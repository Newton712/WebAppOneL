// src/components/PairingsList.jsx
import React, { useState } from 'react';
import ColorDropdown from './ColorDropdown';
import { supabase } from '../lib/supabase';

export default function PairingsList({ pairings, refresh }) {
  const [editingId, setEditingId] = useState(null);
  const [editedRows, setEditedRows] = useState({});

  const handleEdit = (p) => {
    setEditingId(p.id);
    setEditedRows({
      ...editedRows,
      [p.id]: {
        DeckcolorA1: p.DeckcolorA1,
        DeckcolorA2: p.DeckcolorA2,
        DeckcolorB1: p.DeckcolorB1,
        DeckcolorB2: p.DeckcolorB2,
      },
    });
  };

  const handleChange = (id, field, value) => {
    setEditedRows({
      ...editedRows,
      [id]: {
        ...editedRows[id],
        [field]: value,
      },
    });
  };

  const handleSave = async (id) => {
    const update = editedRows[id];
    const { error } = await supabase.from('pairings').update(update).eq('id', id);
    if (!error) {
      setEditingId(null);
      setEditedRows({});
      refresh();
    }
  };

  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr className="bg-gray-800 text-left">
          <th className="px-2 py-1">Table</th>
          <th className="px-2 py-1">Player 1</th>
          <th className="px-2 py-1">Deck A1</th>
          <th className="px-2 py-1">Deck A2</th>
          <th className="px-2 py-1">Player 2</th>
          <th className="px-2 py-1">Deck B1</th>
          <th className="px-2 py-1">Deck B2</th>
          <th className="px-2 py-1">Action</th>
        </tr>
      </thead>
      <tbody>
        {pairings.map((p) => {
          const isEditing = editingId === p.id;
          const data = editedRows[p.id] || {};
          return (
            <tr key={p.id} className="border-t border-gray-700">
              <td className="px-2 py-1">{p.tablenum}</td>
              <td className="px-2 py-1">{p.player_1}</td>
              <td className="px-2 py-1">
                <ColorDropdown
                  value={isEditing ? data.DeckcolorA1 : p.DeckcolorA1}
                  onChange={(val) => handleChange(p.id, 'DeckcolorA1', val)}
                  disabled={!isEditing}
                />
              </td>
              <td className="px-2 py-1">
                <ColorDropdown
                  value={isEditing ? data.DeckcolorA2 : p.DeckcolorA2}
                  onChange={(val) => handleChange(p.id, 'DeckcolorA2', val)}
                  disabled={!isEditing}
                />
              </td>
              <td className="px-2 py-1">{p.player_2}</td>
              <td className="px-2 py-1">
                <ColorDropdown
                  value={isEditing ? data.DeckcolorB1 : p.DeckcolorB1}
                  onChange={(val) => handleChange(p.id, 'DeckcolorB1', val)}
                  disabled={!isEditing}
                />
              </td>
              <td className="px-2 py-1">
                <ColorDropdown
                  value={isEditing ? data.DeckcolorB2 : p.DeckcolorB2}
                  onChange={(val) => handleChange(p.id, 'DeckcolorB2', val)}
                  disabled={!isEditing}
                />
              </td>
              <td className="px-2 py-1">
                {!isEditing ? (
                  <button onClick={() => handleEdit(p)} className="bg-yellow-600 px-2 py-1 text-white rounded">Modifier</button>
                ) : (
                  <button onClick={() => handleSave(p.id)} className="bg-green-600 px-2 py-1 text-white rounded">Sauver</button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
