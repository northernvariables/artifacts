import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

const SHARE_URL = 'https://axorc.substack.com';

export const ResultsScreen = ({
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
  const { axisScores, partyDistances, provincialPartyDistances, confidence, consistencyIssues } = results;

  const federalQs = useMemo(
    () => questions.filter((question) => question.jurisdiction === 'federal').length,
    [questions]
  );
  const provincialQs = useMemo(
    () => questions.filter((question) => question.jurisdiction === 'provincial').length,
    [questions]
  );

  const sortedParties = useMemo(() =>
    Object.entries(partyDistances)
      .sort(([, a], [, b]) => b.alignment - a.alignment)
      .map(([code, data]) => ({
        code,
        name: parties[code].name,
        alignment: data.alignment,
        color: parties[code].color
      })),
  [partyDistances, parties]);

  const sortedProvincialParties = useMemo(() => {
    const provincial = provincialParties[province] || {};
    return Object.entries(provincialPartyDistances)
      .sort(([, a], [, b]) => b.alignment - a.alignment)
      .map(([code, data]) => ({
        code,
        name: provincial[code].name,
        alignment: data.alignment,
        color: provincial[code].color
      }));
  }, [provincialPartyDistances, provincialParties, province]);

  const scatterData = useMemo(() => [
    {
      name: 'You',
      x: axisScores.economic_model || 0,
      y: axisScores.social_values || 0,
      z: 20,
      color: '#EF4444'
    },
    ...Object.entries(parties).map(([code, party]) => ({
      name: party.name,
      x: party.economic_model,
      y: party.social_values,
      z: 15,
      color: party.color
    }))
  ], [axisScores, parties]);

  const shareText = useMemo(() => {
    if (!sortedParties.length) {
      return '';
    }

    const pastVoteNote = pastVote2021 && !pastVote2021.includes('not') && !pastVote2021.includes('Prefer')
      ? `\n(I voted ${pastVote2021} in 2021)`
      : '';

    const topThree = sortedParties.slice(0, 3).map((party, index) => `${index + 1}. ${party.name} - ${party.alignment.toFixed(0)}%`).join('\n');

    return `I just took the Canadian Vote Spectrum quiz!\n\nMy top matches:\n${topThree}${pastVoteNote}\n\nFind out where you stand on Canadian politics!\n\n@northernvariables`;
  }, [sortedParties, pastVote2021]);

  const handleThreadsShare = () => {
    const threadsUrl = `https://threads.net/intent/post?text=${encodeURIComponent(shareText)}`;
    window.open(threadsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyResults = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Results copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy results. Please try again.');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-4 py-8">
      <div className="max-w-6xl mx-auto">
        {dataSubmitted && (
          <div className="mb-6 bg-green-100 border-2 border-green-600 rounded-lg p-4 text-center">
            <p className="text-lg font-bold text-green-800">
              Thank you for contributing to Canadian political research!
            </p>
            <p className="text-sm text-green-700">
              Your anonymized responses have been securely submitted. This helps us understand Canadian political trends.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Results</h2>
              <p className="text-gray-600">
                Based on your responses to {Object.keys(responses).length} questions ({federalQs} federal{provincialQs > 0 ? `, ${provincialQs} ${province} provincial` : ''})
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              confidence === 'high' ? 'bg-green-100 text-green-800' :
              confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {confidence.toUpperCase()} CONFIDENCE
            </div>
          </div>

          {sortedParties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div
                className="p-6 rounded-xl shadow-lg border-4 text-center"
                style={{
                  borderColor: sortedParties[0].color,
                  backgroundColor: `${sortedParties[0].color}15`
                }}
              >
                <div className="text-sm font-semibold text-gray-600 mb-2">YOUR TOP FEDERAL MATCH</div>
                <div className="flex items-center justify-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: sortedParties[0].color }}
                  >
                    #1
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold" style={{ color: sortedParties[0].color }}>
                      {sortedParties[0].name}
                    </div>
                    <div className="text-lg font-semibold text-gray-700">
                      {sortedParties[0].alignment.toFixed(0)}% match
                    </div>
                  </div>
                </div>
              </div>

              {provincialQs > 0 && sortedProvincialParties.length > 0 && (
                <div
                  className="p-6 rounded-xl shadow-lg border-4 text-center"
                  style={{
                    borderColor: sortedProvincialParties[0].color,
                    backgroundColor: `${sortedProvincialParties[0].color}15`
                  }}
                >
                  <div className="text-sm font-semibold text-gray-600 mb-2">YOUR TOP {province} PROVINCIAL MATCH</div>
                  <div className="flex items-center justify-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: sortedProvincialParties[0].color }}
                    >
                      #1
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold" style={{ color: sortedProvincialParties[0].color }}>
                        {sortedProvincialParties[0].name}
                      </div>
                      <div className="text-lg font-semibold text-gray-700">
                        {sortedProvincialParties[0].alignment.toFixed(0)}% match
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {pastVote2021 && !pastVote2021.includes('not') && !pastVote2021.includes('Prefer') && sortedParties.length > 0 && (
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How Your Views Have Evolved</h3>
              <p className="text-gray-700 mb-2">
                In 2021, you voted <strong>{pastVote2021}</strong>.
              </p>
              <p className="text-gray-700">
                {sortedParties[0].name === pastVote2021 ? (
                  <span className="text-green-700 font-semibold">
                    Your top match is still {pastVote2021}! Your views appear consistent with your past voting behavior.
                  </span>
                ) : (
                  <span className="text-blue-700 font-semibold">
                    Your top match is now {sortedParties[0].name}. Your political positioning may have shifted since 2021, or your priorities may have changed in response to current issues.
                  </span>
                )}
              </p>
            </div>
          )}

          {consistencyIssues.length > 0 && (
            <div className="mb-8 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">Consistency Note</h3>
              <ul className="list-disc list-inside space-y-1 text-yellow-800">
                {consistencyIssues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Federal Party Alignment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sortedParties}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" height={70} interval={0} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(0)}%`} />
                  <Legend />
                  <Bar dataKey="alignment" name="Alignment %">
                    {sortedParties.map((entry) => (
                      <Cell key={entry.code} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Provincial Party Alignment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sortedProvincialParties}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" height={70} interval={0} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(0)}%`} />
                  <Legend />
                  <Bar dataKey="alignment" name="Alignment %">
                    {sortedProvincialParties.map((entry) => (
                      <Cell key={entry.code} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Axis Details</h3>
              <div className="space-y-3">
                {Object.entries(axisScores).map(([axis, score]) => (
                  <div key={axis} className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">{axis.replace(/_/g, ' ').toUpperCase()}</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-2 ${score >= 0 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(1, Math.abs(score)) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold" style={{ color: score < 0 ? '#2563EB' : '#DC2626' }}>
                      {score > 0 ? '+' : ''}{(score * 100).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Political Spectrum Position</h3>
              <ResponsiveContainer width="100%" height={320}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="Economic Model" domain={[-1, 1]} />
                  <YAxis type="number" dataKey="y" name="Social Values" domain={[-1, 1]} />
                  <ZAxis type="number" dataKey="z" range={[60, 200]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={scatterData} shape="circle">
                    {scatterData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Top Alignment Details</h3>
              {sortedParties.slice(0, 3).map((party) => (
                <div key={party.code} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-semibold" style={{ color: party.color }}>
                      {party.name}
                    </div>
                    <span className="text-sm font-bold text-gray-700">{party.alignment.toFixed(0)}% match</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    You align closely with {party.name} on most axes. Review the breakdown below to see which policy areas drive this alignment.
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Your Axis Positions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(axisScores).slice(0, 8).map(([axis, score]) => (
                  <div key={axis} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      {axis.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: score < -0.3 ? '#3B82F6' : score > 0.3 ? '#EF4444' : '#6B7280' }}
                    >
                      {score > 0 ? '+' : ''}{(score * 100).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Share Your Results</h3>
            <p className="text-gray-600 text-center mb-6">
              Let others know where you stand on the political spectrum!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleThreadsShare}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.186 3.5c-3.763 0-6.815 3.052-6.815 6.815 0 1.546.516 2.97 1.384 4.113L4.5 20.5l6.072-2.255c1.143.868 2.567 1.384 4.113 1.384 3.763 0 6.815-3.052 6.815-6.815S15.949 3.5 12.186 3.5zm0 11.13c-2.38 0-4.315-1.935-4.315-4.315s1.935-4.315 4.315-4.315 4.315 1.935 4.315 4.315-1.935 4.315-4.315 4.315z" />
                </svg>
                Share to Threads
              </button>
              <button
                onClick={handleFacebookShare}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Share to Facebook
              </button>
              <button
                onClick={handleCopyResults}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Results
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onRestart}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
