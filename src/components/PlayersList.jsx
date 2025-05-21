// src/components/PlayersList.jsx
import React, { useState } from 'react';
import ColorDropdown from './ColorDropdown';
import { supabase } from '../lib/supabase';
import jaune from '../assets/colors/jaune.png';
import mauve from '../assets/colors/mauve.png';
import vert from '../assets/colors/vert.png';
import rouge from '../assets/colors/rouge.png';
import bleu from '../assets/colors/bleu.png';
import gris from '../assets/colors/gris.png';

const colorMap = {
  jaune,
  mauve,
  vert,
  rouge,
  bleu,
  gris,
};

export default function PlayersList({ tournamentId, players, refresh }) {
  const [editingId, setEditingId] = useState(null);
  const [editedPlayers, setEditedPlayers] = useState({});

  const handleEdit = (player) => {
    setEditingId(player.id);
    setEditedPlayers({
      ...editedPlayers,
      [player.id]: {
        Deckcolor1: player.Deckcolor1,
        Deckcolor2: player.Deckcolor2,
        comments: player.comments || '',
      },
    });
  };

  const handleChange = (id, field, value) => {
    setEditedPlayers({
      ...editedPlayers,
      [id]: {
        ...editedPlayers[id],
        [field]: value,
      },
    });
  };

  const handleSave = async (id) => {
    const update = editedPlayers[id];
    const { error } = await supabase.from('players').update(update).eq('id', id);
    if (!error) {
      setEditingId(null);
      setEditedPlayers({});
      refresh();
    }
  };

  const sortedPlayers = [...players].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <table className="min-w-full text-sm text-white bg-black border border-gray-700">
      <thead className="bg-gray-800">
        <tr>
          <th className="px-4 py-2">Nom</th>
          <th className="px-4 py-2">Deck 1</th>
          <th className="px-4 py-2">Deck 2</th>
          <th className="px-4 py-2">Commentaires</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {sortedPlayers.map((p) => {
          const isEditing = editingId === p.id;
          const data = editedPlayers[p.id] || {};
          return (
            <tr key={p.id} className="border-t border-gray-700">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">
                {isEditing ? (
                  <ColorDropdown
                    value={data.Deckcolor1}
                    onChange={(val) => handleChange(p.id, 'Deckcolor1', val)}
                    disabled={false}
                  />
                ) : (
                  p.Deckcolor1 && (
                    <img
                      src={colorMap[p.Deckcolor1]}
                      alt={p.Deckcolor1}
                      className="w-6 h-6 inline-block"
                    />
                  )
                )}
              </td>
              <td className="px-4 py-2">
                {isEditing ? (
                  <ColorDropdown
                    value={data.Deckcolor2}
                    onChange={(val) => handleChange(p.id, 'Deckcolor2', val)}
                    disabled={false}
                  />
                ) : (
                  p.Deckcolor2 && (
                    <img
                      src={colorMap[p.Deckcolor2]}
                      alt={p.Deckcolor2}
                      className="w-6 h-6 inline-block"
                    />
                  )
                )}
              </td>
              <td className="px-4 py-2">
                {isEditing ? (
                  <input
                    type="text"
                    className="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full text-white"
                    value={data.comments}
                    onChange={(e) => handleChange(p.id, 'comments', e.target.value)}
                  />
                ) : (
                  <span>{p.comments || ''}</span>
                )}
              </td>
              <td className="px-4 py-2">
                {!isEditing ? (
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-600 px-3 py-1 rounded text-white"
                  >
                    Modifier
                  </button>
                ) : (
                  <button
                    onClick={() => handleSave(p.id)}
                    className="bg-green-600 px-3 py-1 rounded text-white"
                  >
                    Sauver
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
