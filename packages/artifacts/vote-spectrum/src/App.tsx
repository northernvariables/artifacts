import { useState, useEffect, useReducer, useMemo, useCallback } from 'react'
import { NVHeader, NVFooter } from '@design-system/components'
import '@design-system/styles/index.css'

// Import components
import { WelcomeScreen } from './components/WelcomeScreen.jsx'
import { ProvinceScreen } from './components/ProvinceScreen.jsx'
import { PastVoteScreen } from './components/PastVoteScreen.jsx'
import { QuestionsScreen } from './components/QuestionsScreen.jsx'
import { ImportanceScreen } from './components/ImportanceScreen.jsx'
import { KnowledgeScreen } from './components/KnowledgeScreen.jsx'
import { ConsentScreen } from './components/ConsentScreen.jsx'
import { ResultsScreen } from './components/ResultsScreen.jsx'

// Import state management
import { initialState, voteCompassReducer, ACTIONS } from './state.js'
import { getConsentWebhookUrl } from './config.js'

// Data will be loaded from JSON file

// Type for reducer actions
type ReducerAction = {
  type: string
  payload?: any
}

/**
 * Vote Spectrum Application
 * Interactive political alignment survey for Canadian voters
 */
function VoteSpectrum({ data }: { data: any }) {
  const [state, dispatch] = useReducer<(state: any, action: ReducerAction) => any>(voteCompassReducer, initialState)
  const [language, setLanguage] = useState('en')

  const {
    screen,
    province,
    responses,
    questionImportance,
    importance,
    knowledgeAnswers,
    pastVote2021,
    currentQuestionIndex,
    showMilestone,
    consentToShare,
    dataSubmitted
  } = state

  // Extract data
  const allQuestions = data?.allQuestions || []
  const knowledgeQuiz = data?.knowledgeQuiz || []
  const issueBuckets = data?.issueBuckets || []
  const parties = data?.parties || {}
  const provincialParties = data?.provincialParties || {}

  // Filter questions based on province
  const filteredQuestions = useMemo(() => {
    if (!allQuestions) return []

    return allQuestions.filter((q: any) => {
      // Federal questions always included
      if (q.jurisdiction === 'federal') return true

      // Provincial questions only for selected province
      if (q.jurisdiction === 'provincial') {
        if (!province) return false
        if (q.province_gate && Array.isArray(q.province_gate)) {
          return q.province_gate.includes(province)
        }
        return true
      }

      return true
    })
  }, [allQuestions, province])

  // Calculate results
  const calculateResults = useCallback(() => {
    const axisScores: Record<string, number> = {}
    const partyDistances: Record<string, any> = {}
    const provincialPartyDistances: Record<string, any> = {}

    // Initialize party distances
    Object.values(parties || {}).forEach((party: any) => {
      partyDistances[party.code] = {
        party: party.name,
        alignment: 0,
        color: party.color,
        logo: party.logo
      }
    })

    // Calculate scores based on responses
    // (Simplified version - full calculation logic from original app.jsx)
    Object.entries(responses).forEach(([qid, _value]: [string, any]) => {
      const question = filteredQuestions.find((q: any) => q.qid === qid)
      if (!question) return

      // const isImportant = questionImportance[qid]
      // const weight = isImportant ? 2 : 1

      // Calculate axis scores and party alignments
      // (Full logic would be ported from original app.jsx)
    })

    return {
      axisScores,
      partyDistances,
      provincialPartyDistances,
      confidence: 75,
      consistencyIssues: []
    }
  }, [province, filteredQuestions, responses, questionImportance, parties])

  const results = useMemo(() => calculateResults(), [calculateResults])

  // Navigation functions
  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: currentQuestionIndex + 1 })
    } else {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'importance' })
    }
  }, [currentQuestionIndex, filteredQuestions.length])

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: currentQuestionIndex - 1 })
    }
  }, [currentQuestionIndex])

  const restartToProvinceSelection = useCallback(() => {
    dispatch({ type: ACTIONS.RESET })
    dispatch({ type: ACTIONS.SET_SCREEN, payload: 'province' })
  }, [])

  // Submit data
  const submitAnonymizedData = useCallback(async () => {
    if (!consentToShare) {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'results' })
      return
    }

    const webhookUrl = getConsentWebhookUrl()
    if (!webhookUrl) {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'results' })
      return
    }

    const { axisScores, partyDistances } = calculateResults()
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
        .sort(([, a]: any, [, b]: any) => b.alignment - a.alignment)
        .slice(0, 3)
        .map(([code, data]: any) => ({ party: code, alignment: data.alignment }))
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        dispatch({ type: ACTIONS.SET_DATA_SUBMITTED, payload: true })
      }
    } catch (error) {
      console.error('Error submitting data:', error)
    }

    dispatch({ type: ACTIONS.SET_SCREEN, payload: 'results' })
  }, [consentToShare, calculateResults, province, responses, questionImportance, importance, knowledgeAnswers, pastVote2021])

  const hasKnowledgeQuiz = knowledgeQuiz && knowledgeQuiz.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      <NVHeader linkTo="artifacts" />

      {/* Language toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setLanguage((prev) => (prev === 'en' ? 'fr' : 'en'))}
          className="px-4 py-2 rounded-full bg-white/90 border border-gray-300 shadow hover:bg-white transition-colors text-sm font-semibold min-touch"
        >
          {language === 'en' ? 'Français' : 'English'}
        </button>
      </div>

      <main className="flex-1">
        {screen === 'welcome' && (
          <WelcomeScreen
            onStart={() => dispatch({ type: ACTIONS.SET_SCREEN, payload: 'province' })}
          />
        )}

        {screen === 'province' && (
          <ProvinceScreen
            onSelectProvince={(selectedProvince: string) => {
              dispatch({ type: ACTIONS.SET_PROVINCE, payload: selectedProvince })
              dispatch({ type: ACTIONS.SET_SCREEN, payload: 'past-vote' })
            }}
          />
        )}

        {screen === 'past-vote' && (
          <PastVoteScreen
            pastVote2021={pastVote2021}
            onSelectPastVote={(selection: string) => dispatch({ type: ACTIONS.SET_PAST_VOTE, payload: selection })}
            onContinue={() => {
              dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: 0 })
              dispatch({ type: ACTIONS.SET_SCREEN, payload: 'questions' })
            }}
          />
        )}

        {screen === 'questions' && (
          <QuestionsScreen
            province={province}
            questions={filteredQuestions}
            currentQuestionIndex={currentQuestionIndex}
            responses={responses}
            questionImportance={questionImportance}
            showMilestone={showMilestone}
            milestoneMessage={state.milestoneMessage}
            onToggleImportance={(qid: string, value: boolean) =>
              dispatch({ type: ACTIONS.TOGGLE_IMPORTANCE, payload: { qid, value } })
            }
            onResponseChange={(qid: string, value: number) =>
              dispatch({ type: ACTIONS.UPDATE_RESPONSE, payload: { qid, value } })
            }
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
            onSetImportance={(nextImportance: any) =>
              dispatch({ type: ACTIONS.SET_IMPORTANCE, payload: nextImportance })
            }
            onContinue={() =>
              dispatch({
                type: ACTIONS.SET_SCREEN,
                payload: hasKnowledgeQuiz ? 'knowledge' : 'consent'
              })
            }
            onBack={() => dispatch({ type: ACTIONS.SET_SCREEN, payload: 'questions' })}
          />
        )}

        {screen === 'knowledge' && hasKnowledgeQuiz && (
          <KnowledgeScreen
            knowledgeQuiz={knowledgeQuiz}
            knowledgeAnswers={knowledgeAnswers}
            onUpdateAnswer={(qid: string, value: string) =>
              dispatch({ type: ACTIONS.SET_KNOWLEDGE_ANSWER, payload: { qid, value } })
            }
            onComplete={() => dispatch({ type: ACTIONS.SET_SCREEN, payload: 'consent' })}
          />
        )}

        {screen === 'consent' && (
          <ConsentScreen
            consentToShare={consentToShare}
            onToggleConsent={() =>
              dispatch({ type: ACTIONS.SET_CONSENT, payload: !consentToShare })
            }
            onSubmit={submitAnonymizedData}
            onSkip={() => dispatch({ type: ACTIONS.SET_SCREEN, payload: 'results' })}
          />
        )}

        {screen === 'results' && (
          <ResultsScreen
            province={province}
            results={results}
            responses={responses}
            questions={filteredQuestions}
            parties={parties}
            provincialParties={provincialParties}
            pastVote2021={pastVote2021}
            dataSubmitted={dataSubmitted}
            onRestart={restartToProvinceSelection}
          />
        )}
      </main>

      <NVFooter />
    </div>
  )
}

// Main App component with data loading
function App() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [baseResponse, translationResponse] = await Promise.all([
          fetch('/vote-spectrum-data.json'),
          fetch('/translations-fr.json').catch(() => null)
        ])

        if (!baseResponse.ok) {
          throw new Error('Failed to load data')
        }

        const baseJson = await baseResponse.json()
        const translations: any = {}

        if (translationResponse && translationResponse.ok) {
          try {
            translations.fr = await translationResponse.json()
          } catch (translationError) {
            console.warn('Unable to parse French translations', translationError)
          }
        }

        setData({ ...baseJson, translations })
      } catch (err) {
        console.error('Error loading Vote Spectrum data', err)
        setError(err as Error)
      }
    }

    loadData()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Unable to load Vote Spectrum</h1>
          <p className="text-gray-300">Please refresh the page or try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold min-touch"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-300">Loading Vote Spectrum experience...</p>
        </div>
      </div>
    )
  }

  return <VoteSpectrum data={data} />
}

export default App
