import React, { useMemo } from 'react';

const TERRITORY_CODES = new Set(['YT', 'NT', 'NU']);

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

export const QuestionsScreen = ({
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

  const relevantProvinceTags = useMemo(() => {
    if (!currentQuestion || currentQuestion.jurisdiction !== 'provincial') {
      return [];
    }

    if (!province || !Array.isArray(currentQuestion.province_gate)) {
      return [];
    }

    return currentQuestion.province_gate.filter((code) => code === province);
  }, [currentQuestion, province]);

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
                {currentQuestion.jurisdiction === 'provincial' &&
                  relevantProvinceTags.map((code) => (
                    <span
                      key={code}
                      className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full"
                    >
                      {code} {TERRITORY_CODES.has(code) ? 'TERRITORIAL' : 'PROVINCIAL'}
                    </span>
                  ))}
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

              <div className="grid grid-cols-5 gap-2 mt-4">
                {SCALE_LABELS.map(({ value, short }) => (
                  <button
                    key={value}
                    onClick={() => onResponseChange(currentQuestion.qid, value)}
                    className={`py-2 px-3 rounded-lg border-2 font-semibold text-sm transition-all duration-200 ${
                      Math.abs(currentValue - value) <= 12
                        ? 'border-red-600 bg-red-50 text-red-900'
                        : 'border-gray-200 hover:border-gray-400 text-gray-600'
                    }`}
                  >
                    {short}
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-3 mt-6 h-[4rem] flex items-center overflow-y-auto rounded-lg border-l-4 ${
              showMilestone ? 'bg-green-100 border-green-600' : 'bg-blue-50 border-blue-500'
            }`}>
              {showMilestone ? (
                <p className="text-sm text-green-900 font-bold animate-pulse">{milestoneMessage}</p>
              ) : (
                <p className="text-sm text-blue-900">
                  <strong>Did you know?</strong> {randomFact}
                </p>
              )}
            </div>
          </div>

          <div className="absolute bottom-8 left-8 right-8 flex gap-3">
            {currentQuestionIndex > 0 && (
              <button
                onClick={onPrevious}
                className="px-6 py-2 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Previous
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button
                onClick={onSkip}
                className="px-6 py-2 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Skip
              </button>
              {responses[currentQuestion.qid] !== undefined && (
                <button
                  onClick={onNext}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Continue'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
