import React from 'react';

const PROVINCES = ['BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU'];

export const ProvinceScreen = ({ onSelectProvince }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
    <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Province</h2>
      <p className="text-gray-600 mb-6">This helps us show you relevant provincial questions.</p>

      <div className="grid grid-cols-2 gap-3">
        {PROVINCES.map((prov) => (
          <button
            key={prov}
            onClick={() => onSelectProvince(prov)}
            className="py-3 px-4 border-2 border-gray-200 hover:border-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
          >
            {prov}
          </button>
        ))}
      </div>
    </div>
  </div>
);
