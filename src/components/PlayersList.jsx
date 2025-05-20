// src/components/PlayersList.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ColorDropdown from './ColorDropdown';

export default function PlayersList({ tournamentId }) {
  const [players, setPlayers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedPlayer, setEditedPlayer] = useState({});

  useEffect(() => {
    fetchPlayers();
  }, [tournamentId]);

  async function fetchPlayers() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('tournament_id', tournamentId);
    setPlayers(data);
  }

  function startEdit(player) {
    setEditId(player.id);
    setEditedPlayer({ ...player });
  }

  function cancelEdit() {
    setEditId(null);
    setEditedPlayer({});
  }

  async function savePlayer() {
    await supabase.from('players').update({
      name: editedPlayer.name,
      Deckcolor1: editedPlayer.Deckcolor1,
      Deckcolor2: editedPlayer.Deckcolor2,
      comments: editedPlayer.comments
    }).eq('id', editedPlayer.id);

    setEditId(null);
    fetchPlayers();
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Deck 1</th>
            <th className="p-2 border">Deck 2</th>
            <th className="p-2 border">Commentaire</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">
                {editId === p.id ? (
                  <input
                    className="border rounded px-2 py-1"
                    value={editedPlayer.name}
                    onChange={(e) => setEditedPlayer({ ...editedPlayer, name: e.target.value })}
                  />
                ) : (
                  p.name
                )}
              </td>
              <td className="p-2 border">
                {editId === p.id ? (
                  <ColorDropdown
                    value={editedPlayer.Deckcolor1}
                    onChange={(val) => setEditedPlayer({ ...editedPlayer, Deckcolor1: val })}
                  />
                ) : (
                  <ColorDropdown value={p.Deckcolor1} readOnly />
                )}
              </td>
              <td className="p-2 border">
                {editId === p.id ? (
                  <ColorDropdown
                    value={editedPlayer.Deckcolor2}
                    onChange={(val) => setEditedPlayer({ ...editedPlayer, Deckcolor2: val })}
                  />
                ) : (
                  <ColorDropdown value={p.Deckcolor2} readOnly />
                )}
              </td>
              <td className="p-2 border">
                {editId === p.id ? (
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={editedPlayer.comments || ''}
                    onChange={(e) => setEditedPlayer({ ...editedPlayer, comments: e.target.value })}
                  />
                ) : (
                  p.comments
                )}
              </td>
              <td className="p-2 border">
                {editId === p.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={savePlayer}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      💾
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      ✖
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(p)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    ✏️
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
