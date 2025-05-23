// src/components/RoundsTabs.jsx
import React from 'react';

export default function RoundsTabs({ pairings, selectedRound, onSelectRound, onImport }) {
  const uniqueRounds = [...new Set(pairings.map(p => p.round))].filter(Boolean);

  return (
    <div>
      <div className="flex space-x-2 overflow-x-auto">
        {uniqueRounds.map((round) => (
          <button
            key={round}
            onClick={() => onSelectRound(round)}
            className={`px-4 py-2 rounded border ${selectedRound === round ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            {round}
          </button>
        ))}
        <button
          onClick={onImport}
          className="px-4 py-2 rounded border bg-green-600 text-white hover:bg-green-700"
        >
          + Importer
        </button>
      </div>

      <div className="mt-4">
        {/* Content of selected round is handled outside */}
      </div>
    </div>
  );
}
