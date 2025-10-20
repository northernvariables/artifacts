import React from 'react';

export const WelcomeScreen = ({ onStart }) => (
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
          <strong className="ml-2">Privacy:</strong> Your responses are private and never tracked.
          At the end, you can optionally contribute anonymized data for research.
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
