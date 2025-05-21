// src/components/PlayersList.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ColorDropdown from './ColorDropdown';
import jaune from '../assets/colors/jaune.png';
import mauve from '../assets/colors/mauve.png';
import vert from '../assets/colors/vert.png';
import rouge from '../assets/colors/rouge.png';
import bleu from '../assets/colors/bleu.png';
import gris from '../assets/colors/gris.png';

const colorIcons = { jaune, mauve, vert, rouge, bleu, gris };

export default function PlayersList({ tournamentId }) {
  const [players, setPlayers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

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

  function startEdit(player) {
    setEditingId(player.id);
    setFormData({
      Deckcolor1: player.Deckcolor1 || '',
      Deckcolor2: player.Deckcolor2 || '',
      comments: player.comments || '',
    });
  }

  async function saveEdit(playerId) {
    const { error } = await supabase
      .from('players')
      .update(formData)
      .eq('id', playerId);

    if (!error) {
      setEditingId(null);
      setFormData({});
      fetchPlayers();
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-white">
        <thead className="bg-black text-white">
          <tr>
            <th className="p-2">Nom</th>
            <th className="p-2">Deck 1</th>
            <th className="p-2">Deck 2</th>
            <th className="p-2">Commentaires</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody className="bg-black text-white">
          {players.map((player) => (
            <tr key={player.id}>
              <td className="p-2">{player.name}</td>
              <td className="p-2">
                {editingId === player.id ? (
                  <ColorDropdown
                    value={formData.Deckcolor1}
                    onChange={(v) => setFormData({ ...formData, Deckcolor1: v })}
                  />
                ) : (
                  player.Deckcolor1 && (
                    <img
                      src={colorIcons[player.Deckcolor1]}
                      alt={player.Deckcolor1}
                      className="w-6 h-6"
                    />
                  )
                )}
              </td>
              <td className="p-2">
                {editingId === player.id ? (
                  <ColorDropdown
                    value={formData.Deckcolor2}
                    onChange={(v) => setFormData({ ...formData, Deckcolor2: v })}
                  />
                ) : (
                  player.Deckcolor2 && (
                    <img
                      src={colorIcons[player.Deckcolor2]}
                      alt={player.Deckcolor2}
                      className="w-6 h-6"
                    />
                  )
                )}
              </td>
              <td className="p-2">
                {editingId === player.id ? (
                  <input
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    className="bg-black border text-white p-1 w-full"
                  />
                ) : (
                  <span>{player.comments}</span>
                )}
              </td>
              <td className="p-2">
                {editingId === player.id ? (
                  <button
                    className="bg-green-500 px-3 py-1 rounded"
                    onClick={() => saveEdit(player.id)}
                  >
                    Sauver
                  </button>
                ) : (
                  <button
                    className="bg-yellow-600 px-3 py-1 rounded"
                    onClick={() => startEdit(player)}
                  >
                    Modifier
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
