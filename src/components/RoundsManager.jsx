// src/components/RoundsManager.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function RoundsManager({ tournamentId }) {
  const [pairings, setPairings] = useState([]);
  const [activeRound, setActiveRound] = useState('');
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    fetchRounds();
  }, [tournamentId]);

  async function fetchRounds() {
    const { data } = await supabase
      .from('pairings')
      .select('round')
      .eq('tournament_id', tournamentId);

    const uniqueRounds = [...new Set(data.map(p => p.round))].sort((a, b) => {
      const na = parseInt(a.replace(/\D/g, ''));
      const nb = parseInt(b.replace(/\D/g, ''));
      return na - nb;
    });

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

    setPairings(data || []);
  }

  return (
    <div className="text-white mt-6 space-y-4">
      {/* Onglets des rounds */}
      <div className="flex flex-wrap gap-2">
        {rounds.map(round => (
          <button
            key={round}
            onClick={() => setActiveRound(round)}
            className={`px-4 py-1 rounded text-sm font-semibold ${
              activeRound === round ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'
            }`}
          >
            {round}
          </button>
        ))}
        <button
          onClick={async () => {
            await fetch(`/import/tables/${tournamentId}`, { method: "POST" });
            fetchRounds(); // Refresh rounds
          }}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          ➕ Importer
        </button>
      </div>

      {/* Tableau des pairings */}
      <table className="w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded overflow-hidden">
        <thead className="bg-[#2a2a2a] text-gray-100 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 border-b border-gray-700">Table</th>
            <th className="px-4 py-3 border-b border-gray-700">Player 1</th>
            <th className="px-4 py-3 border-b border-gray-700">Player 2</th>
          </tr>
        </thead>
        <tbody>
          {pairings.map((p, idx) => (
            <tr key={p.id} className={idx % 2 === 0 ? 'bg-[#1e1e1e]' : 'bg-[#2a2a2a]'}>
              <td className="px-4 py-2 border-b border-gray-700">{p.tablenum}</td>
              <td className="px-4 py-2 border-b border-gray-700">{p.player_1}</td>
              <td className="px-4 py-2 border-b border-gray-700">{p.player_2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
