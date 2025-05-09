import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function RoundDetails() {
  const { id } = useParams();
  const [tables, setTables] = useState([]);
  const [players, setPlayers] = useState([]);
  const [newTable, setNewTable] = useState({ player_id: '', color1: '', color2: '' });

  useEffect(() => {
    fetchTables();
    fetchPlayers();
  }, []);

  async function fetchTables() {
    const { data } = await supabase
      .from('tables')
      .select('*, players(name)')
      .eq('round_id', id);
    setTables(data || []);
  }

  async function fetchPlayers() {
    const { data } = await supabase.from('players').select('id, name');
    setPlayers(data || []);
  }

  async function handleAddTable(e) {
    e.preventDefault();
    const { error } = await supabase.from('tables').insert({
      round_id: id,
      player_id: newTable.player_id,
      color1: newTable.color1,
      color2: newTable.color2,
    });

    if (!error) {
      setNewTable({ player_id: '', color1: '', color2: '' });
      fetchTables();
    }
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Détails du round</h2>

      <form className="flex gap-4 mb-6" onSubmit={handleAddTable}>
        <select
          value={newTable.player_id}
          onChange={(e) => setNewTable({ ...newTable, player_id: e.target.value })}
          className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-3 py-2"
        >
          <option value="">Sélectionner un joueur</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Couleur 1"
          value={newTable.color1}
          onChange={(e) => setNewTable({ ...newTable, color1: e.target.value })}
          className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Couleur 2"
          value={newTable.color2}
          onChange={(e) => setNewTable({ ...newTable, color2: e.target.value })}
          className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Ajouter table
        </button>
      </form>

      <table className="w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b border-gray-700">Joueur</th>
            <th className="px-4 py-2 border-b border-gray-700">Couleur 1</th>
            <th className="px-4 py-2 border-b border-gray-700">Couleur 2</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((t) => (
            <tr key={t.id}>
              <td className="px-4 py-2 border-b border-gray-700">{t.players?.name}</td>
              <td className="px-4 py-2 border-b border-gray-700">{t.color1}</td>
              <td className="px-4 py-2 border-b border-gray-700">{t.color2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}