// src/components/RoundsManager.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ColorDropdown from './ColorDropdown';

export default function RoundsManager({ tournamentId, pairings = [], selectedRound, onRoundChange, reload }) {
  const [rounds, setRounds] = useState([]);
  const [edited, setEdited] = useState({});

  useEffect(() => {
    fetchRounds();
  }, [tournamentId]);

  async function fetchRounds() {
    const { data, error } = await supabase
      .from('pairings')
      .select('round')
      .eq('tournament_id', tournamentId);

    if (error) {
      console.error("❌ fetchRounds error:", error);
      return;
    }

    const uniqueRounds = [...new Set(data.map(p => p.round))];
    setRounds(uniqueRounds);
    if (uniqueRounds.length > 0 && !selectedRound) {
      onRoundChange(uniqueRounds[0]);
    }
  }

  function updateField(id, field, value) {
    setEdited(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  async function savePairing(id) {
    const updates = edited[id];
    if (updates) {
      await supabase.from('pairings').update(updates).eq('id', id);
      setEdited(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      reload();
    }
  }

  async function importTables() {
    await fetch(`${import.meta.env.VITE_API_URL}/import/tables/${tournamentId}`, {
      method: 'POST'
    });
    fetchRounds();
    reload();
  }

  const currentTables = pairings.filter(p => p.round === selectedRound);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex gap-2">
        {rounds.map(round => (
          <button
            key={round}
            onClick={() => onRoundChange(round)}
            className={`px-3 py-1 rounded ${selectedRound === round ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {round}
          </button>
        ))}
        <button
          onClick={importTables}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          ➕ Importer
        </button>
      </div>

      <table className="w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded overflow-hidden">
        <thead className="bg-[#2a2a2a] text-gray-100 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 border-b border-gray-700">Table</th>
            <th className="px-4 py-3 border-b border-gray-700 text-center">Player 1</th>
            <th className="px-4 py-3 border-b border-gray-700 text-center">Player 2</th>
            <th className="px-4 py-3 border-b border-gray-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTables.map(p => (
            <tr key={p.id}>
              <td className="px-4 py-3 border-b border-gray-700">{p.tablenum}</td>
              <td className="px-4 py-3 border-b border-gray-700">{p.player_1}</td>
              <td className="px-4 py-3 border-b border-gray-700">{p.player_2}</td>
              <td className="px-4 py-3 border-b border-gray-700">
                <button
                  onClick={() => savePairing(p.id)}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  💾
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

