// components/RoundsManager.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import PlayersList from './PlayersList';

export default function RoundsManager({ tournament, players }) {
  const [rounds, setRounds] = useState([]);
  const [tablesByRound, setTablesByRound] = useState({});
  const [newRoundName, setNewRoundName] = useState('');
  const [newTable, setNewTable] = useState({});
  const [editPlayer, setEditPlayer] = useState(null);

  useEffect(() => {
    fetchRounds();
  }, []);

  async function fetchRounds() {
    const { data: roundsData } = await supabase
      .from('rounds')
      .select('*')
      .eq('tournament_id', tournament.id);
    setRounds(roundsData || []);

    for (let round of roundsData || []) {
      const { data: tables } = await supabase
        .from('tables')
        .select('*')
        .eq('round_id', round.id);
      setTablesByRound((prev) => ({ ...prev, [round.id]: tables || [] }));
    }
  }

async function savePlayer(id) {
  if (!editPlayer.name.trim()) return;

  await supabase.from('players').update({
    name: editPlayer.name.trim(),
    comments: editPlayer.comments?.trim() || null,
    Deckcolor1: editPlayer.Deckcolor1 || null,
    Deckcolor2: editPlayer.Deckcolor2 || null
  }).eq('id', id);

  setEditPlayer(null);
}

  async function handleAddRound() {
    if (!newRoundName.trim()) return;

    const parsedNumber = parseInt(newRoundName, 10);
    if (isNaN(parsedNumber)) {
      alert("Le numéro du round doit être un nombre.");
      return;
    }

    const { data, error } = await supabase
      .from('rounds')
      .insert({ tournament_id: tournament.id, number: parsedNumber })
      .select();

    if (!error && data?.length) {
      setNewRoundName('');
      setTablesByRound({});
      await fetchRounds();
    } else {
      alert("Erreur lors de la création du round.");
      console.error(error);
    }
  }

  async function handleAddTable(roundId) {
    const t = newTable[roundId];
    if (!t || !t.player1 || !t.player2 || !t.tableColor1 || !t.tableColor2) return;

    const player1 = players.find(p => p.id === t.player1);
    const player2 = players.find(p => p.id === t.player2);

    const tableInsert = {
      round_id: roundId,
      player1_id: t.player1,
      player2_id: t.player2,
      color1_player1: player1.color1,
      color2_player1: player1.color2,
      color1_player2: player2.color1,
      color2_player2: player2.color2,
      table_color1: t.tableColor1,
      table_color2: t.tableColor2,
    };

    await supabase.from('tables').insert(tableInsert);
    fetchRounds();
    setNewTable((prev) => ({ ...prev, [roundId]: {} }));
  }

  return (
    <div>
      <PlayersList
        players={players}
        editPlayer={editPlayer}
        setEditPlayer={setEditPlayer}
        savePlayer={savePlayer}
      />

      {/* Ajouter un round */}
      <div className="mb-6">
        <input
          value={newRoundName}
          onChange={(e) => setNewRoundName(e.target.value)}
          className="border rounded px-2 py-1 mr-2"
          placeholder="Nom du round"
        />
        <button onClick={handleAddRound} className="bg-blue-600 px-3 py-1 rounded">
          Ajouter un round
        </button>
      </div>

      {/* Liste des rounds et des tables */}
      {rounds.map((round) => (
        <div key={round.id} className="mb-8 border-t border-gray-700 pt-4">
          <h3 className="text-xl font-semibold mb-2">Round {round.number}</h3>

          {/* Formulaire d'ajout de table */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <select
              value={newTable[round.id]?.player1 || ''}
              onChange={(e) =>
                setNewTable((prev) => ({
                  ...prev,
                  [round.id]: { ...prev[round.id], player1: e.target.value },
                }))
              }
              className="border px-2 py-1 rounded"
            >
              <option value="">Joueur 1</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <select
              value={newTable[round.id]?.player2 || ''}
              onChange={(e) =>
                setNewTable((prev) => ({
                  ...prev,
                  [round.id]: { ...prev[round.id], player2: e.target.value },
                }))
              }
              className="border px-2 py-1 rounded"
            >
              <option value="">Joueur 2</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <input
              type="text"
              placeholder="Couleur 1 de la table"
              value={newTable[round.id]?.tableColor1 || ''}
              onChange={(e) =>
                setNewTable((prev) => ({
                  ...prev,
                  [round.id]: { ...prev[round.id], tableColor1: e.target.value },
                }))
              }
              className="border px-2 py-1 rounded"
            />

            <input
              type="text"
              placeholder="Couleur 2 de la table"
              value={newTable[round.id]?.tableColor2 || ''}
              onChange={(e) =>
                setNewTable((prev) => ({
                  ...prev,
                  [round.id]: { ...prev[round.id], tableColor2: e.target.value },
                }))
              }
              className="border px-2 py-1 rounded"
            />

            <button
              onClick={() => handleAddTable(round.id)}
              className="bg-green-600 px-3 py-1 rounded"
            >
              Ajouter une table
            </button>
          </div>

          {/* Affichage des tables */}
          <table className="w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b border-gray-700">Joueur 1</th>
                <th className="px-4 py-2 border-b border-gray-700">Joueur 2</th>
                <th className="px-4 py-2 border-b border-gray-700">Couleurs J1</th>
                <th className="px-4 py-2 border-b border-gray-700">Couleurs J2</th>
                <th className="px-4 py-2 border-b border-gray-700">Couleurs Table</th>
              </tr>
            </thead>
            <tbody>
              {(tablesByRound[round.id] || []).map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-2 border-b border-gray-700">{players.find(p => p.id === t.player1_id)?.name}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{players.find(p => p.id === t.player2_id)?.name}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{t.color1_player1}, {t.color2_player1}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{t.color1_player2}, {t.color2_player2}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{t.table_color1}, {t.table_color2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
