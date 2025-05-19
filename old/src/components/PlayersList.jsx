// src/components/PlayersList.jsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function PlayersList({ tournamentId, players, reload }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ ...p });
  };

  const saveEdit = async () => {
    await supabase
      .from('players')
      .update({
        Deckcolor1: form.Deckcolor1,
        Deckcolor2: form.Deckcolor2,
        comments: form.comments
      })
      .eq('id', editing);

    setEditing(null);
    reload();
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-2">Joueurs</h2>
      <table className="table-auto w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Deck 1</th>
            <th className="p-2 border">Deck 2</th>
            <th className="p-2 border">Commentaires</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id} className="text-center">
              <td className="border p-1">{p.name}</td>
              <td className="border p-1">
                {editing === p.id ? (
                  <input
                    value={form.Deckcolor1 || ''}
                    onChange={(e) => setForm({ ...form, Deckcolor1: e.target.value })}
                    className="border px-1"
                  />
                ) : (
                  p.Deckcolor1 || '-'
                )}
              </td>
              <td className="border p-1">
                {editing === p.id ? (
                  <input
                    value={form.Deckcolor2 || ''}
                    onChange={(e) => setForm({ ...form, Deckcolor2: e.target.value })}
                    className="border px-1"
                  />
                ) : (
                  p.Deckcolor2 || '-'
                )}
              </td>
              <td className="border p-1">
                {editing === p.id ? (
                  <input
                    value={form.comments || ''}
                    onChange={(e) => setForm({ ...form, comments: e.target.value })}
                    className="border px-1"
                  />
                ) : (
                  p.comments || '-'
                )}
              </td>
              <td className="border p-1">
                {editing === p.id ? (
                  <button
                    onClick={saveEdit}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Enregistrer
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(p)}
                    className="text-blue-600 underline"
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
