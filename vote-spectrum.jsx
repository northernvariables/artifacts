import React, { useReducer, useMemo, useEffect, useCallback } from 'react';
import { allQuestions } from './vote-spectrum/data/questions';
import { knowledgeQuiz } from './vote-spectrum/data/knowledge';
import { issueBuckets } from './vote-spectrum/data/importance';
import { parties, provincialParties } from './vote-spectrum/data/parties';
import { getConsentWebhookUrl } from './vote-spectrum/config';
import { initialState, ACTIONS, voteCompassReducer } from './vote-spectrum/state';
import { WelcomeScreen } from './vote-spectrum/components/WelcomeScreen';
import { ProvinceScreen } from './vote-spectrum/components/ProvinceScreen';
import { PastVoteScreen } from './vote-spectrum/components/PastVoteScreen';
import { QuestionsScreen } from './vote-spectrum/components/QuestionsScreen';
import { ImportanceScreen } from './vote-spectrum/components/ImportanceScreen';
import { KnowledgeScreen } from './vote-spectrum/components/KnowledgeScreen';
import { ConsentScreen } from './vote-spectrum/components/ConsentScreen';
import { ResultsScreen } from './vote-spectrum/components/ResultsScreen';

const MILESTONES = [
  { value: 25, upperBound: 30, message: "25% Complete! You're doing great!" },
  { value: 50, upperBound: 55, message: 'Halfway there! Keep up the momentum!' },
  { value: 75, upperBound: 80, message: '75% Done! Almost at the finish line!' }
];

const VoteCompass = () => {
  const [state, dispatch] = useReducer(voteCompassReducer, initialState);
  const {
    screen,
    province,
    responses,
    questionImportance,
    importance,
    knowledgeAnswers,
    pastVote2021,
    currentQuestionIndex,
    milestoneFlags,
    showMilestone,
    milestoneMessage,
    consentToShare,
    dataSubmitted
  } = state;

  const questions = useMemo(() => {
    return allQuestions.filter((question) => {
      if (question.jurisdiction === 'federal') {
        return true;
      }

      if (question.jurisdiction === 'provincial' && Array.isArray(question.province_gate)) {
        return question.province_gate.includes(province);
      }

      return false;
    });
  }, [province]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= questions.length) {
      dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: 0 });
    }
  }, [questions.length, currentQuestionIndex]);

  useEffect(() => {
    if (screen !== 'questions' || !questions.length) {
      return undefined;
    }

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const milestone = MILESTONES.find((item) => {
      const hasReached = progress >= item.value && progress < item.upperBound;
      const hasSeen = Boolean(milestoneFlags[item.value]);
      return hasReached && !hasSeen;
    });

    if (!milestone) {
      return undefined;
    }

    dispatch({ type: ACTIONS.MARK_MILESTONE, payload: milestone.value });
    dispatch({ type: ACTIONS.SHOW_MILESTONE, payload: milestone.message });

    const timeout = setTimeout(() => {
      dispatch({ type: ACTIONS.HIDE_MILESTONE });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [currentQuestionIndex, screen, questions.length, milestoneFlags]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: currentQuestionIndex + 1 });
    } else {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'importance' });
    }
  }, [currentQuestionIndex, questions.length]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: currentQuestionIndex - 1 });
    }
  }, [currentQuestionIndex]);

  const restartToProvinceSelection = useCallback(() => {
    dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: 0 });
    dispatch({ type: ACTIONS.SET_SCREEN, payload: 'province' });
  }, []);

  const calculateResults = useCallback(() => {
    const axisScores = {};
    const axisWeights = {};
    const federalAxisScores = {};
    const federalAxisWeights = {};
    const provincialAxisScores = {};
    const provincialAxisWeights = {};

    const axes = Object.keys(parties.CPC).filter((key) => key !== 'name' && key !== 'color');
    axes.forEach((axis) => {
      axisScores[axis] = 0;
      axisWeights[axis] = 0;
      federalAxisScores[axis] = 0;
      federalAxisWeights[axis] = 0;
      provincialAxisScores[axis] = 0;
      provincialAxisWeights[axis] = 0;
    });

    questions.forEach((question) => {
      const response = responses[question.qid];
      if (response === undefined || response === null) {
        return;
      }

      const value = (response - 50) / 50;
      const importanceMultiplier = questionImportance[question.qid] ? 1.5 : 1.0;

      question.axis_map.forEach((mapping) => {
        const contribution = value * mapping.weight * mapping.polarity * importanceMultiplier;
        axisScores[mapping.axis_id] += contribution;
        axisWeights[mapping.axis_id] += Math.abs(mapping.weight) * importanceMultiplier;

        if (question.jurisdiction === 'federal') {
          federalAxisScores[mapping.axis_id] += contribution;
          federalAxisWeights[mapping.axis_id] += Math.abs(mapping.weight) * importanceMultiplier;
        } else if (question.jurisdiction === 'provincial') {
          provincialAxisScores[mapping.axis_id] += contribution;
          provincialAxisWeights[mapping.axis_id] += Math.abs(mapping.weight) * importanceMultiplier;
        }
      });
    });

    axes.forEach((axis) => {
      if (axisWeights[axis] > 0) {
        axisScores[axis] = axisScores[axis] / axisWeights[axis];
      }
      if (federalAxisWeights[axis] > 0) {
        federalAxisScores[axis] = federalAxisScores[axis] / federalAxisWeights[axis];
      }
      if (provincialAxisWeights[axis] > 0) {
        provincialAxisScores[axis] = provincialAxisScores[axis] / provincialAxisWeights[axis];
      }
    });

    const partyDistances = {};
    Object.entries(parties).forEach(([code, party]) => {
      let sumSquares = 0;
      let count = 0;

      Object.keys(federalAxisScores).forEach((axis) => {
        if (party[axis] === undefined) {
          return;
        }

        const diff = federalAxisScores[axis] - party[axis];
        sumSquares += diff * diff;
        count += 1;
      });

      const distance = count > 0 ? Math.sqrt(sumSquares / count) : 0;
      partyDistances[code] = {
        distance,
        alignment: Math.max(0, (1 - distance / 2) * 100)
      };
    });

    const provincialPartyDistances = {};
    const provincial = provincialParties[province] || {};
    Object.entries(provincial).forEach(([code, party]) => {
      let sumSquares = 0;
      let count = 0;

      Object.keys(provincialAxisScores).forEach((axis) => {
        if (party[axis] === undefined) {
          return;
        }

        const diff = provincialAxisScores[axis] - party[axis];
        sumSquares += diff * diff;
        count += 1;
      });

      if (count === 0) {
        return;
      }

      const distance = Math.sqrt(sumSquares / count);
      provincialPartyDistances[code] = {
        distance,
        alignment: Math.max(0, (1 - distance / 2) * 100)
      };
    });

    const totalQuestions = questions.length;
    const neutralCount = Object.values(responses).filter((value) => value === 50).length;
    const knowledgeCorrect = Object.entries(knowledgeAnswers).filter(([qid, answer]) => {
      const quizQuestion = knowledgeQuiz.find((item) => item.qid === qid);
      return quizQuestion && answer === quizQuestion.correct;
    }).length;
    const knowledgeRate = knowledgeQuiz.length > 0 ? knowledgeCorrect / knowledgeQuiz.length : 1;

    let confidence = 'high';
    if (totalQuestions === 0) {
      confidence = 'low';
    } else if (neutralCount / totalQuestions > 0.5 || knowledgeRate < 0.375) {
      confidence = 'low';
    } else if (neutralCount / totalQuestions > 0.3 || knowledgeRate < 0.6) {
      confidence = 'medium';
    }

    const consistencyIssues = [];
    if (responses['ECON_PROGRESSIVE_TAX'] !== undefined && responses['ECON_BALANCED_BUDGETS'] !== undefined) {
      if (responses['ECON_PROGRESSIVE_TAX'] <= 20 && responses['ECON_BALANCED_BUDGETS'] >= 80) {
        consistencyIssues.push("You strongly support both higher taxes for social programs and balanced budgets - these may be in tension.");
      }
    }
    if (responses['CONT_US_POLITICAL_INFLUENCE'] !== undefined && responses['CONT_US_MEDIA_REGULATION'] !== undefined) {
      if (responses['CONT_US_POLITICAL_INFLUENCE'] >= 80 && responses['CONT_US_MEDIA_REGULATION'] <= 20) {
        consistencyIssues.push("You strongly agree US influence is a problem but strongly oppose regulating US political content - how would you address the concern?");
      }
    }

    return {
      axisScores,
      partyDistances,
      provincialPartyDistances,
      confidence,
      consistencyIssues
    };
  }, [province, questions, responses, questionImportance, knowledgeAnswers]);

  const results = useMemo(() => calculateResults(), [calculateResults]);

  const submitAnonymizedData = useCallback(async () => {
    if (!consentToShare) {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'results' });
      return;
    }

    const webhookUrl = getConsentWebhookUrl();
    if (!webhookUrl) {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'results' });
      return;
    }

    const { axisScores, partyDistances } = calculateResults();
    const payload = {
      timestamp: new Date().toISOString(),
      province,
      responses,
      questionImportance,
      importanceWeights: importance,
      knowledgeAnswers,
      pastVote2021,
      axisScores,
      topThreeParties: Object.entries(partyDistances)
        .sort(([, a], [, b]) => b.alignment - a.alignment)
        .slice(0, 3)
        .map(([code, data]) => ({ party: code, alignment: data.alignment }))
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        dispatch({ type: ACTIONS.SET_DATA_SUBMITTED, payload: true });
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }

    dispatch({ type: ACTIONS.SET_SCREEN, payload: 'results' });
  }, [consentToShare, calculateResults, province, responses, questionImportance, importance, knowledgeAnswers, pastVote2021]);

  return (
    <div className="font-sans min-h-screen flex flex-col">
      <div className="flex-1">
        {screen === 'welcome' && (
          <WelcomeScreen onStart={() => dispatch({ type: ACTIONS.SET_SCREEN, payload: 'province' })} />
        )}
        {screen === 'province' && (
          <ProvinceScreen
            onSelectProvince={(selectedProvince) => {
              dispatch({ type: ACTIONS.SET_PROVINCE, payload: selectedProvince });
              dispatch({ type: ACTIONS.SET_SCREEN, payload: 'past-vote' });
            }}
          />
        )}
        {screen === 'past-vote' && (
          <PastVoteScreen
            pastVote2021={pastVote2021}
            onSelectPastVote={(selection) => dispatch({ type: ACTIONS.SET_PAST_VOTE, payload: selection })}
            onContinue={() => {
              dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: 0 });
              dispatch({ type: ACTIONS.SET_SCREEN, payload: 'questions' });
            }}
          />
        )}
        {screen === 'questions' && (
          <QuestionsScreen
            province={province}
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            responses={responses}
            questionImportance={questionImportance}
            showMilestone={showMilestone}
            milestoneMessage={milestoneMessage}
            onToggleImportance={(qid, value) => dispatch({ type: ACTIONS.TOGGLE_IMPORTANCE, payload: { qid, value } })}
            onResponseChange={(qid, value) => dispatch({ type: ACTIONS.UPDATE_RESPONSE, payload: { qid, value } })}
            onSkip={goToNextQuestion}
            onNext={goToNextQuestion}
            onPrevious={goToPreviousQuestion}
            onRestart={restartToProvinceSelection}
          />
        )}
        {screen === 'importance' && (
          <ImportanceScreen
            importance={importance}
            issueBuckets={issueBuckets}
            onSetImportance={(nextImportance) => dispatch({ type: ACTIONS.SET_IMPORTANCE, payload: nextImportance })}
            onContinue={() => dispatch({ type: ACTIONS.SET_SCREEN, payload: 'knowledge' })}
            onBack={() => dispatch({ type: ACTIONS.SET_SCREEN, payload: 'questions' })}
          />
        )}
        {screen === 'knowledge' && (
          <KnowledgeScreen
            knowledgeQuiz={knowledgeQuiz}
            knowledgeAnswers={knowledgeAnswers}
            onUpdateAnswer={(qid, value) => dispatch({ type: ACTIONS.SET_KNOWLEDGE_ANSWER, payload: { qid, value } })}
            onComplete={() => dispatch({ type: ACTIONS.SET_SCREEN, payload: 'consent' })}
          />
        )}
        {screen === 'consent' && (
          <ConsentScreen
            consentToShare={consentToShare}
            onToggleConsent={(value) => dispatch({ type: ACTIONS.SET_CONSENT, payload: value })}
            onSubmit={submitAnonymizedData}
            onSkip={() => {
              dispatch({ type: ACTIONS.SET_CONSENT, payload: false });
              dispatch({ type: ACTIONS.SET_SCREEN, payload: 'results' });
            }}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen
            results={results}
            responses={responses}
            questions={questions}
            province={province}
            parties={parties}
            provincialParties={provincialParties}
            pastVote2021={pastVote2021}
            dataSubmitted={dataSubmitted}
            onRestart={() => dispatch({ type: ACTIONS.RESET })}
          />
        )}
      </div>

      <footer className="bg-gray-900 text-white py-6 px-4 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm mb-2">{new Date().getFullYear()} Northern Variables. All rights reserved.</p>
          <p className="text-sm text-gray-400">
            Read more political analysis at{' '}
            <a
              href="https://axorc.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline transition-colors"
            >
              Northern Variables on Substack
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VoteCompass;
