// src/TournamentDetails.jsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import ColorDropdown from './ColorDropdown';
import jaune from './assets/colors/jaune.png';
import mauve from './assets/colors/mauve.png';
import vert from './assets/colors/vert.png';
import rouge from './assets/colors/rouge.png';
import bleu from './assets/colors/bleu.png';
import gris from './assets/colors/gris.png';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const colorImages = { jaune, mauve, vert, rouge, bleu, gris };

export default function TournamentDetails({ tournament, onBack }) {
  const [rounds, setRounds] = useState([]);
  const [tablesByRound, setTablesByRound] = useState({});
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [description, setDescription] = useState('');
  const [color1, setColor1] = useState('');
  const [color2, setColor2] = useState('');
  const [meleeUrl, setMeleeUrl] = useState('');
  const [editPlayer, setEditPlayer] = useState(null);
  const [newRoundName, setNewRoundName] = useState('');
  const [newTable, setNewTable] = useState({});

  useEffect(() => {
    fetchRounds();
    fetchPlayers();
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

  async function fetchPlayers() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('tournament_id', tournament.id);
    setPlayers(data || []);
  }

  async function addPlayer() {
    if (!playerName.trim()) return;
    await supabase.from('players').insert({
      tournament_id: tournament.id,
      name: playerName.trim(),
      description: description.trim() || null,
      color1: color1 || null,
      color2: color2 || null
    });
    setPlayerName('');
    setDescription('');
    setColor1('');
    setColor2('');
    fetchPlayers();
  }

  async function savePlayer(id) {
    if (!editPlayer.name.trim()) return;
    await supabase.from('players').update({
      name: editPlayer.name.trim(),
      description: editPlayer.description?.trim() || null,
      color1: editPlayer.color1 || null,
      color2: editPlayer.color2 || null
    }).eq('id', id);
    setEditPlayer(null);
    fetchPlayers();
  }

  async function importFromMelee() {
    const match = meleeUrl.match(/\/(\d+)$/);
    if (!match) return alert("Lien melee.gg invalide");
    const meleeId = match[1];

    try {
      const response = await fetch(`https://www.melee.gg/api/player/list/${meleeId}`);
      if (!response.ok) throw new Error("Erreur API melee");
      const data = await response.json();

      const existingNames = players.map(p => p.name);
      const newPlayers = data.filter(p => !existingNames.includes(p.name));

      const insertData = newPlayers.map(p => ({
        tournament_id: tournament.id,
        name: p.name,
        description: '',
        color1: '',
        color2: ''
      }));

      await supabase.from('players').insert(insertData);
      fetchPlayers();
      alert(`${insertData.length} joueur(s) importé(s)`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'import depuis melee.gg");
    }
  }

  async function handleAddRound() {
    if (!newRoundName.trim()) return;
    const { data, error } = await supabase
      .from('rounds')
      .insert({ tournament_id: tournament.id, name: newRoundName })
      .select();
    if (!error && data?.length) {
      setNewRoundName('');
      fetchRounds();
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
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Détails du tournoi : {tournament.name}</h2>

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
          <h3 className="text-xl font-semibold mb-2">{round.name}</h3>

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

      <div className="mt-8 text-center">
        <button onClick={onBack} className="bg-red-500 px-4 py-2 rounded">
          Retour
        </button>
      </div>
    </div>
  );
}
