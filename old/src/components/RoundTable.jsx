// src/components/RoundTable.jsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function RoundTable({ pairings, round, reload }) {
  const filtered = pairings.filter(p => p.round === round);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ ...p });
  };

  const saveEdit = async () => {
    await supabase.from('pairings').update({
      DeckcolorA1: form.DeckcolorA1,
      DeckcolorA2: form.DeckcolorA2,
      DeckcolorB1: form.DeckcolorB1,
      DeckcolorB2: form.DeckcolorB2
    }).eq('id', editing);
    setEditing(null);
    reload();
  };

  return (
    <table className="w-full mt-4 table-auto border">
      <thead className="bg-gray-100">
        <tr>
          <th>Table</th>
          <th>Player 1</th>
          <th>Deck A1</th>
          <th>Deck A2</th>
          <th>Player 2</th>
          <th>Deck B1</th>
          <th>Deck B2</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((p) => (
          <tr key={p.id} className="text-center">
            <td>{p.tablenum}</td>
            <td>{p.player_1}</td>
            <td>
              {editing === p.id ? (
                <input
                  value={form.DeckcolorA1 || ''}
                  onChange={(e) => setForm({ ...form, DeckcolorA1: e.target.value })}
                  className="border px-1"
                />
              ) : p.DeckcolorA1 || '-'}
            </td>
            <td>
              {editing === p.id ? (
                <input
                  value={form.DeckcolorA2 || ''}
                  onChange={(e) => setForm({ ...form, DeckcolorA2: e.target.value })}
                  className="border px-1"
                />
              ) : p.DeckcolorA2 || '-'}
            </td>
            <td>{p.player_2}</td>
            <td>
              {editing === p.id ? (
                <input
                  value={form.DeckcolorB1 || ''}
                  onChange={(e) => setForm({ ...form, DeckcolorB1: e.target.value })}
                  className="border px-1"
                />
              ) : p.DeckcolorB1 || '-'}
            </td>
            <td>
              {editing === p.id ? (
                <input
                  value={form.DeckcolorB2 || ''}
                  onChange={(e) => setForm({ ...form, DeckcolorB2: e.target.value })}
                  className="border px-1"
                />
              ) : p.DeckcolorB2 || '-'}
            </td>
            <td>
              {editing === p.id ? (
                <button
                  onClick={saveEdit}
                  className="bg-blue-500 text-white px-2 rounded"
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
  );
}
