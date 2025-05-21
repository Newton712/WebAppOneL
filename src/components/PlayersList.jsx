// src/components/PlayersList.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import jaune from '../assets/colors/jaune.png';
import mauve from '../assets/colors/mauve.png';
import vert from '../assets/colors/vert.png';
import rouge from '../assets/colors/rouge.png';
import bleu from '../assets/colors/bleu.png';
import gris from '../assets/colors/gris.png';

const colorImages = { jaune, mauve, vert, rouge, bleu, gris };

export default function PlayersList({ tournamentId }) {
  const [players, setPlayers] = useState([]);
  const [editPlayer, setEditPlayer] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, [tournamentId]);

  async function fetchPlayers() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('name');
    if (data) setPlayers(data);
  }

async function savePlayer(playerId) {
  const { error } = await supabase
    .from('players')
    .update({
      name: editPlayer.name,
      comments: editPlayer.comments,
      Deckcolor1: editPlayer.Deckcolor1, // majuscule
      Deckcolor2: editPlayer.Deckcolor2,
    })
    .eq('id', playerId);

  if (!error) {
    setEditPlayer(null);  // <- repasse en mode affichage
    fetchPlayers();       // <- recharge les données avec les couleurs et commentaires
  } else {
    console.error("Erreur lors de la sauvegarde:", error);
  }
}


  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Joueurs du tournoi</h3>
      <table className="w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded overflow-hidden">
        <thead className="bg-[#2a2a2a] text-gray-100 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 border-b border-gray-700">Nom</th>
            <th className="px-4 py-3 border-b border-gray-700">Commentaires</th>
            <th className="px-4 py-3 border-b border-gray-700 text-center">Deck 1</th>
            <th className="px-4 py-3 border-b border-gray-700 text-center">Deck 2</th>
            <th className="px-4 py-3 border-b border-gray-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, idx) => {
            const isEditing = editPlayer?.id === p.id;
            return (
              <tr key={p.id} className={idx % 2 === 0 ? 'bg-[#1e1e1e]' : 'bg-[#2a2a2a]'}>
                <td className="px-4 py-2 border-b border-gray-700">{p.name}</td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {isEditing ? (
                    <input
                      className="w-full bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                      value={editPlayer.comments || ''}
                      onChange={(e) => setEditPlayer({ ...editPlayer, comments: e.target.value })}
                    />
                  ) : (
                    p.comments
                  )}
                </td>
                <td className="px-4 py-2 border-b border-gray-700 text-center">
                  {isEditing ? (
                    <select
                      className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                      value={editPlayer.deckcolor1 || ''}
                      onChange={(e) => setEditPlayer({ ...editPlayer, deckcolor1: e.target.value })}
                    >
                      <option value="">--</option>
                      {Object.keys(colorImages).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    p.Deckcolor1?.toLowerCase() in colorImages ? (
                      <img src={colorImages[p.Deckcolor1.toLowerCase()]} alt={p.Deckcolor1} className="w-5 h-5 inline-block rounded" />
                    ) : (
                      p.Deckcolor1 || ''
                    )
                  )}
                </td>
                <td className="px-4 py-2 border-b border-gray-700 text-center">
                  {isEditing ? (
                    <select
                      className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                      value={editPlayer.deckcolor2 || ''}
                      onChange={(e) => setEditPlayer({ ...editPlayer, deckcolor2: e.target.value })}
                    >
                      <option value="">--</option>
                      {Object.keys(colorImages).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    p.Deckcolor2?.toLowerCase() in colorImages ? (
                      <img src={colorImages[p.Deckcolor2.toLowerCase()]} alt={p.Deckcolor2} className="w-5 h-5 inline-block rounded" />
                    ) : (
                      p.Deckcolor2 || ''
                    )
                  )}
                </td>
                <td className="px-4 py-2 border-b border-gray-700 text-center">
                  {isEditing ? (
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded"
                      onClick={() => savePlayer(p.id)}
                    >
                      💾
                    </button>
                  ) : (
                    <button
                      className="text-blue-400 underline"
                      onClick={() => setEditPlayer(p)}
                    >
                      Modifier
                    </button>
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
