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

const brandingStyles = `
  .nv-header {
    background: linear-gradient(135deg, #091a30 0%, #163b6b 55%, #ff6719 100%);
    border-bottom: 4px solid rgba(255, 255, 255, 0.25);
    padding: 2.25rem 1.5rem;
    box-shadow: 0 10px 30px rgba(9, 26, 48, 0.25);
  }

  .nv-header-inner {
    max-width: 960px;
    margin: 0 auto;
    padding: 3px;
    background: rgba(255, 255, 255, 0.86);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 12px 30px rgba(9, 26, 48, 0.15);
    backdrop-filter: blur(6px);
  }

  .nv-header-inner img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: inherit;
  }

  .nv-footer {
    background: linear-gradient(120deg, #091a30 0%, #0f2747 60%, #d85612 100%);
    color: #f8fafc;
    padding: 2.5rem 1.5rem;
    text-align: center;
    font-size: 0.9rem;
    box-shadow: 0 -12px 24px rgba(15, 39, 71, 0.3);
  }

  .nv-footer a {
    color: #ffd7c2;
    text-decoration: none;
  }

  .nv-footer a:hover {
    color: #ffffff;
  }

  .nv-footer-links {
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: 1rem;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .nv-footer-link {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.65rem 1.25rem;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.08);
    font-weight: 600;
    letter-spacing: 0.02em;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    white-space: nowrap;
  }

  .nv-footer-link:hover {
    background: rgba(255, 255, 255, 0.16);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28);
    transform: translateY(-1px);
  }

  .nv-footer-link-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    background: rgba(15, 23, 42, 0.18);
    color: #fff7ed;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.2);
  }

  .nv-footer-link-icon svg {
    width: 1rem;
    height: 1rem;
    transition: transform 0.2s ease;
  }

  .nv-footer-link-icon--scale svg {
    transform: scale(1.18);
    transform-origin: center;
  }

  .nv-footer-link-text {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
  }

  .nv-footer-link-text span:last-child {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.85;
  }
`;

const headerImageUrl = 'https://northernvariables.ca/wp-content/uploads/2025/10/Northern-Variables-Email-Banner-1.png';

const backgroundStyle = {
  background:
    'radial-gradient(circle at top left, rgba(255, 103, 25, 0.08), transparent 55%), linear-gradient(180deg, rgba(15, 39, 71, 0.22) 0%, rgba(15, 39, 71, 0.12) 240px, #f4f6fb 100%)',
  backgroundColor: '#0f2747'
};

const footerTextStyle = { fontSize: '0.85rem', letterSpacing: '0.01em' };

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

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.textContent = brandingStyles;
    document.head.appendChild(styleTag);

    return () => {
      if (styleTag.parentNode) {
        styleTag.parentNode.removeChild(styleTag);
      }
    };
  }, []);

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
    <div className="font-sans min-h-screen flex flex-col" style={backgroundStyle}>
      <header className="nv-header">
        <div className="nv-header-inner">
          <img src={headerImageUrl} alt="Northern Variables" className="w-full h-auto" />
        </div>
      </header>

      <main className="flex-1">
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
      </main>

      <footer className="nv-footer">
        <div className="max-w-4xl mx-auto text-center">
          <div className="nv-footer-links">
            <a className="nv-footer-link" href="https://northernvariables.ca/" target="_blank" rel="noopener noreferrer">
              <span className="nv-footer-link-icon nv-footer-link-icon--scale" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm6.93 8h-2.764c-.186-2.278-.891-4.312-1.983-5.712A8.027 8.027 0 0 1 18.93 10zM12 4.063c1.155 1.251 1.946 3.52 2.119 5.937H9.881C10.054 7.583 10.845 5.314 12 4.063zM4.5 14a7.95 7.95 0 0 1 0-4h2.708a17.69 17.69 0 0 0 0 4H4.5zm.57 2h2.764c.186 2.278.89 4.312 1.983 5.712A8.027 8.027 0 0 1 5.07 16zm2.764-8H5.07A8.027 8.027 0 0 1 9.317 4.288C8.224 5.688 7.52 7.722 7.334 10zM12 19.937c-1.155-1.251-1.946-3.52-2.119-5.937h4.238C13.946 16.417 13.155 18.686 12 19.937zM14.119 14H9.881a15.73 15.73 0 0 1 0-4h4.238a15.73 15.73 0 0 1 0 4zm.567 5.712c1.093-1.4 1.797-3.434 1.983-5.712h2.764a8.027 8.027 0 0 1-4.747 5.712z" />
                </svg>
              </span>
              <span className="nv-footer-link-text">
                <span>Northern Variables</span>
                <span>Website</span>
              </span>
            </a>
            <a className="nv-footer-link" href="https://axorc.substack.com" target="_blank" rel="noopener noreferrer">
              <span className="nv-footer-link-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4.75C4 3.784 4.784 3 5.75 3h12.5C19.216 3 20 3.784 20 4.75v2.5c0 .966-.784 1.75-1.75 1.75H5.75C4.784 9 4 8.216 4 7.25v-2.5Zm0 5.75 8 4.5 8-4.5v8.75A1.75 1.75 0 0 1 18.25 21H5.75A1.75 1.75 0 0 1 4 19.25V10.5Zm8 2.75L4 8.75V7.25C4 6.284 4.784 5.5 5.75 5.5h12.5C19.216 5.5 20 6.284 20 7.25v1.5l-8 4.5Z" />
                </svg>
              </span>
              <span className="nv-footer-link-text">
                <span>Northern Variables</span>
                <span>Substack</span>
              </span>
            </a>
            <a className="nv-footer-link" href="https://artifacts.northernvariables.ca/" target="_self">
              <span className="nv-footer-link-icon nv-footer-link-icon--scale" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.75 6.25 12 2l7.25 4.25v8.5L12 19l-7.25-4.25v-8.5Zm2.5 1.443v5.365L12 15.69l4.75-2.632V7.693L12 5.06 7.25 7.693ZM12 22l-7.25-4.25 1.5-.879L12 20.25l5.75-3.379 1.5.879L12 22Z" />
                </svg>
              </span>
              <span className="nv-footer-link-text">
                <span>Artifacts Library</span>
                <span>Explore</span>
              </span>
            </a>
          </div>

          <p style={footerTextStyle}>&copy; {new Date().getFullYear()} Northern Variables. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default VoteCompass;
