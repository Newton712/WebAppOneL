// src/components/RoundsTabs.jsx
import React from 'react';

export default function RoundsTabs({ rounds, active, onSelect, tournamentId, refresh }) {
  return (
    <div className="flex gap-2 border-b border-gray-600 pb-2 mb-4">
      {rounds.map((round) => (
        <button
          key={round}
          onClick={() => onSelect(round)}
          className={`px-4 py-2 rounded-t ${
            active === round ? 'bg-[#333] text-white font-bold' : 'bg-[#1e1e1e] text-gray-300'
          }`}
        >
          {round}
        </button>
      ))}
      <button
        onClick={async () => {
          await fetch(`${import.meta.env.VITE_API_URL}/import/tables/${tournamentId}`, {
            method: 'POST',
          });
          refresh();
        }}
        className="ml-auto px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
      >
        Importer
      </button>
    </div>
  );
}
