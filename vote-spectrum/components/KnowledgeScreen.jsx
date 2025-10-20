import React, { useState } from 'react';

export const KnowledgeScreen = ({ knowledgeQuiz, knowledgeAnswers, onUpdateAnswer, onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const question = knowledgeQuiz[currentQ];

  if (!question) {
    return null;
  }

  const currentAnswer = knowledgeAnswers[question.qid];
  const goToNext = () => {
    if (currentQ < knowledgeQuiz.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full mb-4">
              KNOWLEDGE CHECK {currentQ + 1} of {knowledgeQuiz.length}
            </span>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{question.text}</h3>
          </div>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onUpdateAnswer(question.qid, idx)}
                className={`w-full py-4 px-6 rounded-lg border-2 transition-all duration-200 text-left font-medium ${
                  currentAnswer === idx
                    ? 'border-purple-600 bg-purple-50 text-purple-900'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      currentAnswer === idx ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                    }`}
                  >
                    {currentAnswer === idx && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={goToNext}
              className="px-6 py-2 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              Skip
            </button>
            {currentAnswer !== undefined && (
              <button
                onClick={goToNext}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                {currentQ < knowledgeQuiz.length - 1 ? 'Next' : 'Continue'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
