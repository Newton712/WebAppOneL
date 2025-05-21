// src/components/RoundsManager.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ColorDropdown from './ColorDropdown';

export default function RoundsManager({ tournamentId }) {
  const [rounds, setRounds] = useState([]);
  const [activeRound, setActiveRound] = useState('');
  const [pairings, setPairings] = useState([]);
  const [edited, setEdited] = useState({});

  useEffect(() => {
    fetchRounds();
  }, [tournamentId]);

  async function fetchRounds() {
    const { data } = await supabase
      .from('pairings')
      .select('round')
      .eq('tournament_id', tournamentId);
    const uniqueRounds = [...new Set(data.map(p => p.round))];
    setRounds(uniqueRounds);
    setActiveRound(uniqueRounds[0] || '');
  }

  useEffect(() => {
    if (activeRound) fetchPairings();
  }, [activeRound]);

  async function fetchPairings() {
    const { data } = await supabase
      .from('pairings')
      .select('*')
      .eq('tournament_id', tournamentId)
      .eq('round', activeRound);
    setPairings(data);
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
      fetchPairings();
    }
  }

  async function importTables() {
    await fetch(`${import.meta.env.VITE_API_URL}/import/tables/${tournamentId}`, {
      method: 'POST'
    });
    fetchRounds();
    fetchPairings();
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex gap-2">
        {rounds.map(round => (
          <button
            key={round}
            onClick={() => setActiveRound(round)}
            className={`px-3 py-1 rounded ${activeRound === round ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
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

      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Table</th>
            <th className="p-2 border">Player 1</th>

            <th className="p-2 border">Player 2</th>

            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {pairings.map(p => (
            <tr key={p.id}>
              <td className="p-2 border">{p.tablenum}</td>
              <td className="p-2 border">{p.player_1}</td>

              <td className="p-2 border">{p.player_2}</td>
              <td className="p-2 border">
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
