// src/components/RoundsManager.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import jaune from '../assets/colors/jaune.png';
import mauve from '../assets/colors/mauve.png';
import vert from '../assets/colors/vert.png';
import rouge from '../assets/colors/rouge.png';
import bleu from '../assets/colors/bleu.png';
import gris from '../assets/colors/gris.png';

const colorImages = { jaune, mauve, vert, rouge, bleu, gris };

export default function RoundsManager({ tournamentId }) {
  const [rounds, setRounds] = useState([]);
  const [activeRound, setActiveRound] = useState('');
  const [pairings, setPairings] = useState([]);
  const [editRow, setEditRow] = useState(null);

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
    setPairings(data.sort((a, b) => parseInt(a.tablenum) - parseInt(b.tablenum)));
  }

  async function savePairing(id) {
    const updated = editRow;
    const { error } = await supabase
      .from('pairings')
      .update(updated)
      .eq('id', id);

    if (!error) {
      setEditRow(null);
      fetchPairings();
    }
  }

  return (
    <div className="mb-6 bg-[#1e1e1e]">
      <div className="flex gap-2 mb-4">
        {rounds.map(round => (
          <button
            key={round}
            onClick={() => setActiveRound(round)}
            className={`px-3 py-1 rounded ${activeRound === round ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
          >
            {round}
          </button>
        ))}
      </div>

      <table className="w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded overflow-hidden">
        <thead className="bg-[#2a2a2a] text-gray-100 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 border-b border-gray-700">Table</th>
            <th className="px-4 py-3 border-b border-gray-700">Player 1</th>
             <th className="px-4 py-3 border-b border-gray-700">Player 2</th>
            <th className="px-4 py-3 border-b border-gray-700">Player 1 - Color 1</th>
            <th className="px-4 py-3 border-b border-gray-700">Player 1 - Color 2</th>
            <th className="px-4 py-3 border-b border-gray-700">VS</th>
            <th className="px-4 py-3 border-b border-gray-700">Player 2 - Color 1</th>
            <th className="px-4 py-3 border-b border-gray-700">Player 2 - Color 2</th>
            <th className="px-4 py-3 border-b border-gray-700">Assigned</th>
            <th className="px-4 py-3 border-b border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pairings.map((p, idx) => {
            const isEditing = editRow?.id === p.id;
            return (
              <tr key={p.id} className={idx % 2 === 0 ? 'bg-[#1e1e1e]' : 'bg-[#2a2a2a]'}>
                <td className="px-4 py-2 border-b border-gray-700">{p.tablenum}</td>
                <td className="px-4 py-2 border-b border-gray-700">{p.player_1}</td>
                <td className="px-4 py-2 border-b border-gray-700">{p.player_2}</td>

                {['deckcolora1', 'deckcolora2'].map(field => (
                  <td className="px-4 py-2 border-b border-gray-700 text-center" key={field}>
                    {isEditing ? (
                      <select
                        className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                        value={editRow[field] || ''}
                        onChange={(e) => setEditRow({ ...editRow, [field]: e.target.value })}
                      >
                        <option value="">--</option>
                        {Object.keys(colorImages).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    ) : (
                      p[field] && <img src={colorImages[p[field]]} alt={p[field]} className="w-5 h-5 inline-block rounded" />
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 border-b border-gray-700">VS</td>

                {['deckcolorb1', 'deckcolorb2'].map(field => (
                  <td className="px-4 py-2 border-b border-gray-700 text-center" key={field}>
                    {isEditing ? (
                      <select
                        className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                        value={editRow[field] || ''}
                        onChange={(e) => setEditRow({ ...editRow, [field]: e.target.value })}
                      >
                        <option value="">--</option>
                        {Object.keys(colorImages).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    ) : (
                      p[field] && <img src={colorImages[p[field]]} alt={p[field]} className="w-5 h-5 inline-block rounded" />
                    )}
                  </td>
                ))}
                
                <td className="px-4 py-2 border-b border-gray-700 text-center">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editRow.assignedcolor || false}
                      onChange={(e) => setEditRow({ ...editRow, assignedcolor: e.target.checked })}
                    />
                  ) : (
                    <input type="checkbox" checked={p.assignedcolor} readOnly />
                  )}
                </td>
                <td className="px-4 py-2 border-b border-gray-700 text-center">
                  {isEditing ? (
                    <button
                      onClick={() => savePairing(p.id)}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >💾</button>
                  ) : (
                    <button
                      onClick={() => setEditRow(p)}
                      className="text-blue-400 underline"
                    >Modifier</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
