import React from 'react';

const PAST_VOTE_OPTIONS = [
  'Liberal',
  'Conservative',
  'NDP',
  'Bloc Quebecois',
  'Green',
  'PPC',
  'Other/Did not vote',
  'Prefer not to say'
];

export const PastVoteScreen = ({ pastVote2021, onSelectPastVote, onContinue }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">One More Question</h2>
      <p className="text-gray-600 mb-6">
        This helps us calibrate your results more accurately.
      </p>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-4">
          Which party did you vote for in the 2021 federal election? (Optional)
        </label>
        <div className="space-y-3">
          {PAST_VOTE_OPTIONS.map((party) => (
            <button
              key={party}
              onClick={() => onSelectPastVote(party)}
              className={`w-full py-3 px-6 rounded-lg border-2 transition-all duration-200 text-left font-medium ${
                pastVote2021 === party
                  ? 'border-red-600 bg-red-50 text-red-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {party}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
      >
        Continue to Questions
      </button>
    </div>
  </div>
);
