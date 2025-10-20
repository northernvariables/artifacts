const { useState, useMemo, useEffect, useReducer, useCallback } = React;

const rechartsAvailable = typeof window !== 'undefined' && typeof window.Recharts === 'object' && window.Recharts !== null;

const createChartFallback = (message) => {
  const FallbackComponent = () => (
    <div className="h-full w-full flex items-center justify-center text-sm text-gray-500 text-center px-4 py-6 border border-dashed border-gray-300 rounded-lg bg-gray-50">
      {message}
    </div>
  );
  return FallbackComponent;
};

const fallbackResponsiveContainer = ({ children }) => <div className="w-full h-full">{children}</div>;
const FallbackScatterChart = createChartFallback('Interactive scatter plot unavailable. Please refresh to retry.');
const FallbackBarChart = createChartFallback('Interactive alignment chart unavailable. Please refresh to retry.');

const RechartsLib = rechartsAvailable ? window.Recharts : {};
const {
  ResponsiveContainer = fallbackResponsiveContainer,
  BarChart = FallbackBarChart,
  Bar = () => null,
  XAxis = () => null,
  YAxis = () => null,
  CartesianGrid = () => null,
  Tooltip = () => null,
  Legend = () => null,
  Cell = () => null,
  ScatterChart = FallbackScatterChart,
  Scatter = () => null,
  ZAxis = () => null
} = RechartsLib;

const ACTIONS = {
  SET_SCREEN: 'SET_SCREEN',
  SET_PROVINCE: 'SET_PROVINCE',
  SET_PAST_VOTE: 'SET_PAST_VOTE',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  UPDATE_RESPONSE: 'UPDATE_RESPONSE',
  TOGGLE_IMPORTANCE: 'TOGGLE_IMPORTANCE',
  SET_IMPORTANCE: 'SET_IMPORTANCE',
  SET_KNOWLEDGE_ANSWER: 'SET_KNOWLEDGE_ANSWER',
  SET_CONSENT: 'SET_CONSENT',
  MARK_MILESTONE: 'MARK_MILESTONE',
  SHOW_MILESTONE: 'SHOW_MILESTONE',
  HIDE_MILESTONE: 'HIDE_MILESTONE',
  SET_DATA_SUBMITTED: 'SET_DATA_SUBMITTED',
  RESET: 'RESET'
};

const initialState = {
  screen: 'welcome',
  province: '',
  responses: {},
  questionImportance: {},
  importance: {},
  knowledgeAnswers: {},
  pastVote2021: null,
  currentQuestionIndex: 0,
  milestoneFlags: {},
  showMilestone: false,
  milestoneMessage: '',
  consentToShare: false,
  dataSubmitted: false
};

function voteCompassReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SCREEN:
      return { ...state, screen: action.payload };
    case ACTIONS.SET_PROVINCE:
      return { ...state, province: action.payload };
    case ACTIONS.SET_PAST_VOTE:
      return { ...state, pastVote2021: action.payload };
    case ACTIONS.SET_CURRENT_QUESTION:
      return { ...state, currentQuestionIndex: action.payload };
    case ACTIONS.UPDATE_RESPONSE:
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.payload.qid]: action.payload.value
        }
      };
    case ACTIONS.TOGGLE_IMPORTANCE:
      return {
        ...state,
        questionImportance: {
          ...state.questionImportance,
          [action.payload.qid]: action.payload.value
        }
      };
    case ACTIONS.SET_IMPORTANCE:
      return { ...state, importance: action.payload };
    case ACTIONS.SET_KNOWLEDGE_ANSWER:
      return {
        ...state,
        knowledgeAnswers: {
          ...state.knowledgeAnswers,
          [action.payload.qid]: action.payload.value
        }
      };
    case ACTIONS.SET_CONSENT:
      return { ...state, consentToShare: action.payload };
    case ACTIONS.MARK_MILESTONE:
      return {
        ...state,
        milestoneFlags: {
          ...state.milestoneFlags,
          [action.payload]: true
        }
      };
    case ACTIONS.SHOW_MILESTONE:
      return {
        ...state,
        showMilestone: true,
        milestoneMessage: action.payload
      };
    case ACTIONS.HIDE_MILESTONE:
      return { ...state, showMilestone: false, milestoneMessage: '' };
    case ACTIONS.SET_DATA_SUBMITTED:
      return { ...state, dataSubmitted: action.payload };
    case ACTIONS.RESET:
      return { ...initialState };
    default:
      return state;
  }
}

const MILESTONES = [
  { value: 25, upperBound: 30, message: "25% Complete! You're doing great!" },
  { value: 50, upperBound: 55, message: 'Halfway there! Keep up the momentum!' },
  { value: 75, upperBound: 80, message: '75% Done! Almost at the finish line!' }
];

const getConsentWebhookUrl = () => '';

const WelcomeScreen = ({ onStart }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Canadian Vote Spectrum</h1>
        <p className="text-lg text-gray-600">Discover where you stand on the Canadian political spectrum</p>
      </div>

      <div className="space-y-4 mb-8 text-gray-700">
        <p>This comprehensive voting advice instrument will help you understand your political positioning across multiple dimensions including economic policy, social values, climate priorities, and more.</p>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <p className="font-semibold mb-2">What to expect:</p>
          <ul className="space-y-1 text-sm">
            <li>36 federal policy questions including current events & controversial issues</li>
            <li>Up to 12 province-specific questions</li>
            <li>Mark questions as very important for personalized weighting</li>
            <li>Educational facts about Canadian politics</li>
            <li>Progress milestones to keep you motivated</li>
            <li>Priority weighting exercise across 12 issue areas</li>
            <li>3 knowledge check questions</li>
            <li>Detailed breakdown showing WHY you matched with each party</li>
            <li>Consistency analysis of your responses</li>
            <li>Personalized results with party alignment & 2D positioning</li>
          </ul>
        </div>

        <p className="text-sm text-gray-600">
          <strong>Time estimate:</strong> 15-20 minutes
          <strong className="ml-2">Privacy:</strong> Your responses are private and never tracked. At the end, you can optionally contribute anonymized data for research.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg"
      >
        Get Started
      </button>
    </div>
  </div>
);

const ProvinceScreen = ({ onSelectProvince }) => {
  const provinces = [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Nova Scotia',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Where do you live?</h2>
          <p className="text-gray-600">Choose your province to unlock questions tailored to your local political landscape.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {provinces.map((province) => (
            <button
              key={province}
              onClick={() => onSelectProvince(province)}
              className="p-6 border-2 border-transparent hover:border-red-500 rounded-xl bg-gray-50 hover:bg-red-50 transition-all duration-200 text-left shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900">{province}</h3>
              <p className="text-sm text-gray-600 mt-2">Includes federal issues and provincial questions curated for {province} voters.</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PastVoteScreen = ({ pastVote2021, onSelectPastVote, onContinue }) => {
  const options = [
    'Conservative Party',
    'Liberal Party',
    'New Democratic Party',
    'Green Party',
    'Bloc Québécois',
    'People\'s Party',
    'Independent',
    'Did not vote',
    'Prefer not to say'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">How did you vote federally in 2021?</h2>
          <p className="text-gray-600">This helps us understand your baseline perspective. You can skip if you prefer.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-8">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onSelectPastVote(option)}
              className={`px-5 py-4 rounded-xl border-2 transition-all duration-200 text-left shadow-sm ${
                pastVote2021 === option
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-red-400 bg-gray-50'
              }`}
            >
              <span className="text-sm font-semibold">{option}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onContinue}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow"
          >
            Continue to questionnaire
          </button>
          <button
            onClick={onContinue}
            className="flex-1 bg-white border border-gray-300 hover:border-red-400 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
          >
            Skip question
          </button>
        </div>
      </div>
    </div>
  );
};

const DID_YOU_KNOW_FACTS = [
  'Canada has had 23 Prime Ministers since Confederation in 1867.',
  'The longest-serving PM was William Lyon Mackenzie King (21 years).',
  "Canada's Senate has 105 appointed members who serve until age 75.",
  'The Bloc Quebecois only runs candidates in Quebec ridings.',
  "Canada uses a first-past-the-post electoral system.",
  'Federal elections must be held at least every 5 years.',
  'The Governor General formally appoints the Prime Minister.',
  "Quebec has 78 federal seats, the second-most after Ontario's 121.",
  "A party needs 172 seats to form a majority government in Canada's 343-seat House of Commons.",
  'Canada held a referendum on electoral reform in British Columbia in 2018 - it was defeated.',
  'The Clarity Act (2000) sets conditions for Quebec separation referendums.',
  "Supply management has protected Canadian dairy farmers since the 1970s.",
  "Canada's current voting system was established in 1867 and has never changed.",
  'The notwithstanding clause has been used over 50 times by provincial governments.',
  'About 75% of Canadians live within 100 miles of the US border.',
  "Canada-US trade exceeds $900 billion annually, making it the world's largest bilateral trade relationship.",
  'The US accounts for about 75% of Canada\'s total exports.',
  'CRTC regulations require Canadian radio stations to play at least 35% Canadian content.'
];

const SCALE_LABELS = [
  { value: 0, label: 'Strongly Disagree', short: 'SD' },
  { value: 25, label: 'Disagree', short: 'D' },
  { value: 50, label: 'Neutral', short: 'N' },
  { value: 75, label: 'Agree', short: 'A' },
  { value: 100, label: 'Strongly Agree', short: 'SA' }
];

const getLabelForValue = (value) => {
  if (value <= 10) return 'Strongly Disagree';
  if (value <= 35) return 'Disagree';
  if (value <= 65) return 'Neutral';
  if (value <= 90) return 'Agree';
  return 'Strongly Agree';
};

const QuestionsScreen = ({
  province,
  questions,
  currentQuestionIndex,
  responses,
  questionImportance,
  showMilestone,
  milestoneMessage,
  onToggleImportance,
  onResponseChange,
  onSkip,
  onNext,
  onPrevious,
  onRestart
}) => {
  const currentQuestion = questions[currentQuestionIndex];

  const progress = useMemo(() => {
    if (!questions.length) {
      return 0;
    }
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  }, [currentQuestionIndex, questions.length]);

  const currentValue = currentQuestion ? responses[currentQuestion.qid] ?? 50 : 50;
  const isImportant = currentQuestion ? Boolean(questionImportance[currentQuestion.qid]) : false;
  const randomFact = DID_YOU_KNOW_FACTS[currentQuestionIndex % DID_YOU_KNOW_FACTS.length];

  if (!questions.length || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-xl text-gray-900 mb-4">Loading questions...</p>
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 relative" style={{ height: '900px' }}>
          <div className="h-[800px] overflow-y-auto">
            <div className="mb-8 h-[16rem]">
              <div className="flex gap-2 mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {currentQuestion.issue_bucket.replace(/_/g, ' ').toUpperCase()}
                </span>
                {currentQuestion.jurisdiction === 'provincial' && (
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                    {province} PROVINCIAL
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 h-[10rem] flex items-start overflow-y-auto">
                {currentQuestion.text}
              </h3>

              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => onToggleImportance(currentQuestion.qid, !isImportant)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                    isImportant
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                      : 'border-gray-300 text-gray-600 hover:border-yellow-400'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isImportant ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {isImportant ? 'Very Important to Me' : 'Mark as Important'}
                </button>
              </div>
            </div>

            <div className="space-y-6 h-[420px]">
              <div className="text-center">
                <div className="inline-block px-6 py-3 bg-red-600 text-white rounded-full text-xl font-bold mb-2">
                  {getLabelForValue(currentValue)}
                </div>
                <div className="text-sm text-gray-500">Position: {currentValue}</div>
              </div>

              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={currentValue}
                  onChange={(event) => onResponseChange(currentQuestion.qid, Number(event.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-red-600 via-gray-300 to-blue-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: 'linear-gradient(to right, #DC2626 0%, #EF4444 20%, #D1D5DB 40%, #D1D5DB 60%, #3B82F6 80%, #2563EB 100%)'
                  }}
                />
                <style>{`
                  .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: white;
                    border: 4px solid #DC2626;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  }
                  .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.15);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                  }
                  .slider::-webkit-slider-thumb:active {
                    transform: scale(1.05);
                  }
                  .slider::-moz-range-thumb {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: white;
                    border: 4px solid #DC2626;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  }
                  .slider::-moz-range-thumb:hover {
                    transform: scale(1.15);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                  }
                  .slider::-moz-range-thumb:active {
                    transform: scale(1.05);
                  }
                `}</style>
              </div>

              <div className="flex justify-between text-xs text-gray-600 px-2">
                {SCALE_LABELS.map(({ value, label }) => (
                  <span key={value} className="font-semibold text-center">
                    {label.split(' ').map((word, index) => (
                      <React.Fragment key={`${value}-${word}-${index}`}>
                        {index > 0 && <br />}
                        {word}
                      </React.Fragment>
                    ))}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onPrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  onClick={onSkip}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:border-blue-400"
                >
                  Skip
                </button>
                <button
                  onClick={onNext}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                >
                  Next
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Did you know?</h4>
                <p className="text-sm text-blue-700">{randomFact}</p>
              </div>
            </div>
          </div>

          {showMilestone && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-2xl animate-fade-in">
              <div className="bg-red-100 border border-red-300 text-red-800 px-6 py-3 rounded-xl text-lg font-semibold shadow-lg">
                {milestoneMessage}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ImportanceScreen = ({ importance, issueBuckets, onSetImportance, onContinue, onBack }) => {
  const totalAssigned = useMemo(() => Object.values(importance).reduce((sum, value) => sum + value, 0), [importance]);

  const handleSliderChange = (bucket, value) => {
    onSetImportance({
      ...importance,
      [bucket]: Number(value)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-2/5">
            <div className="sticky top-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Issue Priorities</h2>
              <p className="text-gray-600 mb-6">
                Distribute 100 points across the 12 issue areas to show where you want your vote to focus. The more points you assign, the more weight that issue carries in your results.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <p className="text-sm text-blue-800 font-semibold mb-2">Total Assigned</p>
                <div className="text-3xl font-bold text-blue-900">{totalAssigned} / 100</div>
                <p className="text-xs text-blue-700 mt-2">Tip: Try spreading points across your top 5 priorities.</p>
              </div>
            </div>
          </div>

          <div className="md:w-3/5 space-y-6">
            {issueBuckets.map((bucket) => {
              const value = importance[bucket.id] ?? 0;
              return (
                <div key={bucket.id} className="bg-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{bucket.name}</h3>
                      <p className="text-xs text-gray-600">{bucket.description}</p>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{value}</div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={value}
                    onChange={(event) => handleSliderChange(bucket.id, event.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />

                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0</span>
                    <span>10</span>
                    <span>20</span>
                  </div>
                </div>
              );
            })}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onBack}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:border-red-400"
              >
                Back to questions
              </button>
              <button
                onClick={onContinue}
                className="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
              >
                Continue to knowledge check
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KnowledgeScreen = ({ knowledgeQuiz, knowledgeAnswers, onUpdateAnswer, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = knowledgeQuiz[currentIndex];

  const handleAnswer = (answer) => {
    onUpdateAnswer(currentQuestion.qid, answer);
    if (currentIndex < knowledgeQuiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  if (!knowledgeQuiz.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-xl text-gray-900 mb-4">Loading knowledge check...</p>
        </div>
      </div>
    );
  }

  const currentAnswer = knowledgeAnswers[currentQuestion.qid];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Knowledge Check</h2>
            <p className="text-gray-600">Question {currentIndex + 1} of {knowledgeQuiz.length}</p>
          </div>
          <div className="text-sm bg-blue-50 text-blue-800 px-3 py-1 rounded-full">Civic Literacy</div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentQuestion.text}</h3>
          <p className="text-sm text-gray-600">Select the option you believe is correct.</p>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                currentAnswer === option
                  ? option === currentQuestion.correct
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-blue-400 bg-white'
              }`}
            >
              <span className="text-sm font-semibold">{option}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>These questions help us calibrate the confidence rating in your results.</p>
        </div>
      </div>
    </div>
  );
};

const ConsentScreen = ({ consentToShare, onToggleConsent, onSubmit, onSkip }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Optional: Share anonymized results</h2>
        <p className="text-gray-600">
          Help Northern Variables improve the Vote Spectrum by sharing your anonymized responses. We never store identifying information.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 text-left">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">What we collect:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>Province and high-level demographic info (if provided)</li>
          <li>Your answers to survey questions</li>
          <li>Importance weights and knowledge check results</li>
          <li>Calculated alignment with each party</li>
        </ul>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <input
          id="consent-checkbox"
          type="checkbox"
          checked={consentToShare}
          onChange={(event) => onToggleConsent(event.target.checked)}
          className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
        />
        <label htmlFor="consent-checkbox" className="text-sm text-gray-700">
          I agree to anonymously share my results to improve the Vote Spectrum analysis.
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSubmit}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
        >
          Submit & see results
        </button>
        <button
          onClick={onSkip}
          className="flex-1 bg-white border border-gray-300 hover:border-red-400 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
        >
          Skip and see results
        </button>
      </div>
    </div>
  </div>
);

const ResultsScreen = ({
  results,
  responses,
  questions,
  province,
  parties,
  provincialParties,
  pastVote2021,
  dataSubmitted,
  onRestart
}) => {
  const axes = useMemo(() =>
    Object.keys(parties.CPC).filter((key) => key !== 'name' && key !== 'color')
  , [parties]);

  const partyAlignment = Object.entries(results.partyDistances)
    .map(([code, data]) => ({
      party: parties[code].name,
      alignment: Math.round(data.alignment)
    }))
    .sort((a, b) => b.alignment - a.alignment)
    .slice(0, 5);

  const provincialAlignment = Object.entries(results.provincialPartyDistances || {})
    .map(([code, data]) => ({
      party: provincialParties[province]?.[code]?.name || code,
      alignment: Math.round(data.alignment)
    }))
    .sort((a, b) => b.alignment - a.alignment)
    .slice(0, 5);

  const scatterData = Object.entries(parties).map(([code, party]) => ({
    party: party.name,
    x: party.economic_model * 100,
    y: party.social_values * 100,
    fill: party.color,
    code
  }));

  const userPoint = {
    x: (results.axisScores.economic_model ?? 0) * 100,
    y: (results.axisScores.social_values ?? 0) * 100
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Vote Spectrum Results</h2>
              <p className="text-gray-600">
                Based on {questions.length} questions, importance weighting, and knowledge calibration.
              </p>
            </div>
            <div className="text-sm text-right text-gray-500">
              {pastVote2021 ? `Past vote: ${pastVote2021}` : 'Past vote undisclosed'}
              <br />
              Province: {province || 'Not provided'}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top federal party alignments</h3>
              <div className="space-y-3">
                {partyAlignment.map((item, index) => (
                  <div key={item.party} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm font-semibold text-gray-900">
                        <span>{item.party}</span>
                        <span>{item.alignment}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${item.alignment}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence assessment</h3>
              <p className="text-sm text-gray-600 mb-3">
                We gauge confidence based on how consistently you responded and your knowledge check results.
              </p>
              <div className="text-2xl font-bold text-red-600 capitalize">{results.confidence} confidence</div>
              {results.consistencyIssues.length > 0 && (
                <div className="mt-4 bg-white border border-yellow-300 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">Things to reflect on</h4>
                  <ul className="list-disc pl-5 text-xs text-yellow-700 space-y-1">
                    {results.consistencyIssues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Economic vs Social Spectrum</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" name="Economic" unit="%" domain={[-100, 100]} tickFormatter={(value) => `${value}%`} />
                  <YAxis type="number" dataKey="y" name="Social" unit="%" domain={[-100, 100]} tickFormatter={(value) => `${value}%`} />
                  <ZAxis type="number" range={[60, 160]} />
                  <Tooltip formatter={(value) => `${Math.round(value)}%`} />
                  <Legend />
                  <Scatter name="Parties" data={scatterData}>
                    {scatterData.map((entry) => (
                      <Cell key={entry.code} fill={entry.fill} />
                    ))}
                  </Scatter>
                  <Scatter name="You" data={[userPoint]} fill="#111827">
                    <Cell fill="#111827" />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            {!rechartsAvailable && (
              <p className="mt-4 text-xs text-gray-500">
                Interactive charts are unavailable because the visualization library could not be loaded. Refresh the page to try again.
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Provincial alignments</h3>
            {province ? (
              <div className="space-y-3">
                {provincialAlignment.length ? (
                  provincialAlignment.map((item, index) => (
                    <div key={item.party} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm font-semibold text-gray-900">
                          <span>{item.party}</span>
                          <span>{item.alignment}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.alignment}%` }} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">Insufficient data for provincial alignment.</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">Provincial comparison available after selecting your province.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue weighting summary</h3>
              <div className="space-y-3">
                {Object.entries(results.axisScores).map(([axis, score]) => (
                  <div key={axis} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between text-sm font-semibold text-gray-900">
                      <span>{axis.replace(/_/g, ' ')}</span>
                      <span>{Math.round(score * 100) / 100}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(Math.abs(score) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What to do next</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>Share these insights with your community or explore detailed platform comparisons on our Substack.</p>
                <p>Want to revisit your answers? You can restart and adjust any question to see how alignments change.</p>
                <button
                  onClick={onRestart}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:border-red-400"
                >
                  Restart survey
                </button>
                {dataSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
                    Thank you! Your anonymized contribution is helping refine the Vote Spectrum model.
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg p-4">
                    Consider sharing your anonymized data next time to improve our analysis.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VoteCompass = ({
  allQuestions,
  knowledgeQuiz,
  issueBuckets,
  parties,
  provincialParties
}) => {
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

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((question) => {
      if (question.jurisdiction === 'federal') {
        return true;
      }

      if (question.jurisdiction === 'provincial' && Array.isArray(question.province_gate)) {
        return question.province_gate.includes(province);
      }

      return false;
    });
  }, [province, allQuestions]);

  useEffect(() => {
    if (filteredQuestions.length > 0 && currentQuestionIndex >= filteredQuestions.length) {
      dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: 0 });
    }
  }, [filteredQuestions.length, currentQuestionIndex]);

  useEffect(() => {
    if (screen !== 'questions' || !filteredQuestions.length) {
      return undefined;
    }

    const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;
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
  }, [currentQuestionIndex, screen, filteredQuestions.length, milestoneFlags]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: currentQuestionIndex + 1 });
    } else {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'importance' });
    }
  }, [currentQuestionIndex, filteredQuestions.length]);

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

    filteredQuestions.forEach((question) => {
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

    const totalQuestions = filteredQuestions.length;
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
  }, [province, filteredQuestions, responses, questionImportance, knowledgeAnswers, knowledgeQuiz, parties, provincialParties]);

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
            questions={filteredQuestions}
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
            questions={filteredQuestions}
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

const VoteSpectrumApp = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('./vote-spectrum-data.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        return response.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        console.error('Error loading Vote Spectrum data', err);
        setError(err);
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Unable to load Vote Spectrum</h1>
          <p className="text-gray-300">Please refresh the page or try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-300">Loading Vote Spectrum experience...</p>
        </div>
      </div>
    );
  }

  return (
    <VoteCompass
      allQuestions={data.allQuestions}
      knowledgeQuiz={data.knowledgeQuiz}
      issueBuckets={data.issueBuckets}
      parties={data.parties}
      provincialParties={data.provincialParties}
    />
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<VoteSpectrumApp />);
