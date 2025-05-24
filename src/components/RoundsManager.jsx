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
    <div className="mb-6 overflow-x-auto">
      <div className="flex flex-wrap gap-2 mb-4">
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

      <table className="min-w-[800px] w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded">
        <thead className="bg-[#2a2a2a] text-gray-100 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 border-b">Table</th>
            <th className="px-4 py-3 border-b">Player 1</th>
            <th className="px-4 py-3 border-b">Player 2</th>
            <th className="px-4 py-3 border-b">Deck Player 1</th>
            <th className="px-4 py-3 border-b">VS</th>
            <th className="px-4 py-3 border-b">Deck Player 2</th>
            <th className="px-4 py-3 border-b">Assigned</th>
            <th className="px-4 py-3 border-b">Actions</th>
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
                <td className="px-4 py-2 border-b border-gray-700 text-center">
                  {isEditing ? (
                    <>
                      <select
                        className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1 mb-1"
                        value={editRow.deckcolora1 || ''}
                        onChange={(e) => setEditRow({ ...editRow, deckcolora1: e.target.value })}
                      >
                        <option value="">--</option>
                        {Object.keys(colorImages).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <select
                        className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                        value={editRow.deckcolora2 || ''}
                        onChange={(e) => setEditRow({ ...editRow, deckcolora2: e.target.value })}
                      >
                        <option value="">--</option>
                        {Object.keys(colorImages).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      {p.deckcolora1 && <img src={colorImages[p.deckcolora1]} alt={p.deckcolora1} className="w-5 h-5 inline-block rounded mr-1" />}
                      {p.deckcolora2 && <img src={colorImages[p.deckcolora2]} alt={p.deckcolora2} className="w-5 h-5 inline-block rounded" />}
                    </>
                  )}
                </td>
                <td className="px-4 py-2 border-b border-gray-700 text-center font-bold">VS</td>
                <td className="px-4 py-2 border-b border-gray-700 text-center">
                  {isEditing ? (
                    <>
                      <select
                        className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1 mb-1"
                        value={editRow.deckcolorb1 || ''}
                        onChange={(e) => setEditRow({ ...editRow, deckcolorb1: e.target.value })}
                      >
                        <option value="">--</option>
                        {Object.keys(colorImages).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <select
                        className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                        value={editRow.deckcolorb2 || ''}
                        onChange={(e) => setEditRow({ ...editRow, deckcolorb2: e.target.value })}
                      >
                        <option value="">--</option>
                        {Object.keys(colorImages).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      {p.deckcolorb1 && <img src={colorImages[p.deckcolorb1]} alt={p.deckcolorb1} className="w-5 h-5 inline-block rounded mr-1" />}
                      {p.deckcolorb2 && <img src={colorImages[p.deckcolorb2]} alt={p.deckcolorb2} className="w-5 h-5 inline-block rounded" />}
                    </>
                  )}
                </td>
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
