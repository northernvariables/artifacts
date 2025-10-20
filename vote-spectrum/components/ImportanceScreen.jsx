import React, { useMemo } from 'react';

export const ImportanceScreen = ({
  importance,
  issueBuckets,
  onSetImportance,
  onContinue,
  onBack
}) => {
  const remaining = useMemo(
    () => 100 - Object.values(importance).reduce((sum, value) => sum + value, 0),
    [importance]
  );

  const sortedBuckets = useMemo(() => {
    return [...issueBuckets].sort((a, b) => {
      const aVal = importance[a.id] || 0;
      const bVal = importance[b.id] || 0;
      return bVal - aVal;
    });
  }, [issueBuckets, importance]);

  const incrementValue = (id, amount) => {
    const currentVal = importance[id] || 0;
    const newVal = Math.max(0, Math.min(100, currentVal + amount));
    const diff = newVal - currentVal;

    if (diff > 0 && remaining >= diff) {
      onSetImportance({ ...importance, [id]: newVal });
    } else if (diff < 0) {
      onSetImportance({ ...importance, [id]: newVal });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Matters Most to You?</h2>
          <p className="text-gray-600 mb-6">
            Distribute 100 points across these issues. Give more points to issues that are most important to you.
            Your priorities will personalize your results.
          </p>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
              <div className="text-sm text-blue-800 font-semibold mb-1">POINTS REMAINING</div>
              <div className="text-5xl font-bold text-blue-900">{remaining}</div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  const equalPoints = Math.floor(100 / issueBuckets.length);
                  const newImportance = {};
                  issueBuckets.forEach((bucket, index) => {
                    newImportance[bucket.id] = index === 0 ? equalPoints + (100 - equalPoints * issueBuckets.length) : equalPoints;
                  });
                  onSetImportance(newImportance);
                }}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Distribute Equally
              </button>
              <button
                onClick={() => onSetImportance({})}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {sortedBuckets.map((bucket, index) => {
              const value = importance[bucket.id] || 0;
              const barWidth = value;

              return (
                <div key={bucket.id} className="group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      value > 0 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <label className="font-semibold text-gray-900">{bucket.label}</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => incrementValue(bucket.id, -5)}
                        disabled={value === 0}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-bold text-gray-700 transition-colors"
                      >
                        −
                      </button>
                      <div className="w-16 text-center">
                        <span className="text-2xl font-bold text-red-600">{value}</span>
                      </div>
                      <button
                        onClick={() => incrementValue(bucket.id, 5)}
                        disabled={remaining < 5}
                        className="w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="ml-11 relative">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
            <p className="text-sm text-yellow-900">
              <strong>Tip:</strong> You don't need to use all 100 points. Only allocate points to issues that matter to you.
              Unallocated points mean those issues won't affect your results as much.
            </p>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="px-6 py-3 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-semibold text-gray-700 transition-colors"
            >
              Back to Questions
            </button>
            <button
              onClick={onContinue}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
