// src/components/PlayersList.jsx
import React, { useState } from 'react';
import ColorDropdown from './ColorDropdown';
import { supabase } from '../lib/supabase';

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

  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr className="bg-gray-800 text-left">
          <th className="px-4 py-2">Nom</th>
          <th className="px-4 py-2">Deck 1</th>
          <th className="px-4 py-2">Deck 2</th>
          <th className="px-4 py-2">Commentaires</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {players.map((p) => {
          const isEditing = editingId === p.id;
          const data = editedPlayers[p.id] || {};
          return (
            <tr key={p.id} className="border-t border-gray-700">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">
                <ColorDropdown
                  value={isEditing ? data.Deckcolor1 : p.Deckcolor1}
                  onChange={(val) => handleChange(p.id, 'Deckcolor1', val)}
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2">
                <ColorDropdown
                  value={isEditing ? data.Deckcolor2 : p.Deckcolor2}
                  onChange={(val) => handleChange(p.id, 'Deckcolor2', val)}
                  disabled={!isEditing}
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  className="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full"
                  value={isEditing ? data.comments : p.comments || ''}
                  onChange={(e) => handleChange(p.id, 'comments', e.target.value)}
                  disabled={!isEditing}
                />
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
