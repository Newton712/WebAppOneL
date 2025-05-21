// src/components/RoundsManager.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import RoundsTabs from './RoundsTabs';

export default function RoundsManager({ tournamentId }) {
  const [pairings, setPairings] = useState([]);
  const [activeRound, setActiveRound] = useState('');

  useEffect(() => {
    fetchPairings();
  }, [tournamentId]);

  async function fetchPairings() {
    const { data } = await supabase
      .from('pairings')
      .select('*')
      .eq('tournament_id', tournamentId);

    if (data) {
      setPairings(data);
      const rounds = data.map(p => parseInt(p.round.replace(/[^0-9]/g, ''), 10)).filter(n => !isNaN(n));
      const minRound = rounds.length ? Math.min(...rounds) : '';
      setActiveRound(`Round ${minRound}`);
    }
  }

  const rounds = Array.from(new Set(pairings.map(p => p.round))).sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ''));
    const nb = parseInt(b.replace(/\D/g, ''));
    return na - nb;
  });

  const currentTables = pairings.filter(p => p.round === activeRound);

  return (
    <div className="text-white">
      <RoundsTabs
        rounds={rounds}
        active={activeRound}
        onSelect={setActiveRound}
        tournamentId={tournamentId}
        refresh={fetchPairings}
      />

      <div className="mt-4">
        <table className="w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded overflow-hidden">
          <thead className="bg-[#2a2a2a] text-gray-100 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 border-b border-gray-700">Table</th>
              <th className="px-4 py-3 border-b border-gray-700">Player 1</th>
              <th className="px-4 py-3 border-b border-gray-700">Player 2</th>
            </tr>
          </thead>
          <tbody>
            {currentTables.map((t, idx) => (
              <tr key={t.id} className={idx % 2 === 0 ? 'bg-[#1e1e1e]' : 'bg-[#2a2a2a]'}>
                <td className="px-4 py-2 border-b border-gray-700">{t.tablenum}</td>
                <td className="px-4 py-2 border-b border-gray-700">{t.player_1}</td>
                <td className="px-4 py-2 border-b border-gray-700">{t.player_2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
