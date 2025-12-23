import React from 'react';

export const ConsentScreen = ({ consentToShare, onToggleConsent, onSubmit, onSkip }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
    <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Help Improve Canadian Political Research</h2>

      <div className="space-y-4 mb-6 text-gray-700">
        <p className="text-lg">
          You've completed the survey! Before we show your results, would you like to contribute your anonymized responses to help improve political research in Canada?
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <h3 className="font-bold text-blue-900 mb-2">What WILL be collected (if you consent):</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-900">
            <li>Your province</li>
            <li>Your responses to all survey questions</li>
            <li>Which questions you marked as important</li>
            <li>Your priority issue rankings</li>
            <li>Your past voting behavior (2021)</li>
            <li>Your calculated political positioning</li>
            <li>Timestamp of submission</li>
          </ul>
        </div>

        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
          <h3 className="font-bold text-green-900 mb-2">What will NOT be collected:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-green-900">
            <li>No IP addresses</li>
            <li>No email addresses or names</li>
            <li>No device identifiers or fingerprints</li>
            <li>No cookies or tracking pixels</li>
            <li>No session IDs that could identify you</li>
            <li>No personally identifiable information of any kind</li>
          </ul>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentToShare}
            onChange={(event) => onToggleConsent(event.target.checked)}
            className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <span className="text-gray-900 font-medium">
            I consent to sharing my anonymized survey responses for research purposes as described above.
            I understand that no personally identifiable information will be collected.
          </span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onSkip}
          className="flex-1 py-4 px-6 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-colors"
        >
          No Thanks, Show My Results
        </button>
        <button
          onClick={onSubmit}
          className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-colors ${
            consentToShare ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!consentToShare}
        >
          {consentToShare ? 'Submit & See Results' : 'Please Check Box Above'}
        </button>
      </div>
    </div>
  </div>
);
