// src/App.jsx
import './index.css';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import ColorDropdown from './ColorDropdown';

import jaune from './assets/colors/jaune.png';
import mauve from './assets/colors/mauve.png';
import vert from './assets/colors/vert.png';
import rouge from './assets/colors/rouge.png';
import bleu from './assets/colors/bleu.png';
import gris from './assets/colors/gris.png';

const colorImages = { jaune, mauve, vert, rouge, bleu, gris };

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [newTournamentName, setNewTournamentName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [meleeLink, setMeleeLink] = useState("");

  useEffect(() => {
    fetchTournaments();
  }, []);

  async function fetchTournaments() {
    const { data, error } = await supabase.from('tournaments').select('*');
    if (!error) {
      setTournaments(data);
      setFilteredTournaments(data);
    }
  }

  async function addTournament() {
    if (!newTournamentName.trim()) return;
    const { data, error } = await supabase
      .from('tournaments')
      .insert({ name: newTournamentName })
      .select()
      .single();
    if (!error && data) {
      setNewTournamentName("");
      setTournaments(prev => [...prev, data]);
      setFilteredTournaments(prev => [...prev, data]);
      setSelectedTournament(data);
    }
  }

  async function importFromMelee() {
    const idMatch = meleeLink.match(/\/(\d+)$/);
    if (!idMatch) {
      alert("Lien invalide.");
      return;
    }
    const meleeId = idMatch[1];

    try {
      const response = await fetch(`https://www.melee.gg/api/player/list/${meleeId}`);
      const data = await response.json();

      const tournamentName = `Import ${meleeId}`;
      const { data: newTournament } = await supabase
        .from('tournaments')
        .insert({ name: tournamentName })
        .select()
        .single();

      const playerInserts = data.map(player => ({
        name: player.name,
        tournament_id: newTournament.id,
        description: '',
        color1: '',
        color2: ''
      }));

      await supabase.from('players').insert(playerInserts);
      fetchTournaments();
      setSelectedTournament(newTournament);
      setMeleeLink("");
    } catch (error) {
      console.error("Erreur d'import :", error);
      alert("Échec de l'import.");
    }
  }

  function searchTournament() {
    const filtered = tournaments.filter(t =>
      t.name.toLowerCase().includes(searchName.trim().toLowerCase())
    );
    setFilteredTournaments(filtered);
  }

  function backToList() {
    setSelectedTournament(null);
  }

  return (
    <div className="bg-melee text-white">
      <header className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mx-auto">Suivis de Tournois</h1>
      </header>

      {!selectedTournament && (
        <div className="flex flex-col items-center">
          <div className="mb-4 flex justify-center gap-2">
            <input
              className="border p-2 rounded"
              placeholder="Nom du nouveau tournoi"
              value={newTournamentName}
              onChange={(e) => setNewTournamentName(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addTournament}>
              Créer
            </button>
          </div>

          <div className="mb-6 flex justify-center gap-2">
            <input
              className="border p-2 rounded"
              placeholder="Rechercher un tournoi"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={searchTournament}>
              Rechercher
            </button>
          </div>

          {filteredTournaments.length > 0 && (
            <table className="w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded overflow-hidden">
              <thead className="bg-[#2a2a2a] text-gray-100 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3 border-b border-gray-700">Nom du tournoi</th>
                  <th className="px-4 py-3 border-b border-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTournaments.map((tournament) => (
                  <tr key={tournament.id}>
                    <td className="border px-4 py-2">{tournament.name}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="text-blue-700 underline"
                        onClick={() => setSelectedTournament(tournament)}
                      >
                        Gérer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selectedTournament && (
        <div className="max-w-6xl mx-auto">
          <TournamentDetails tournament={selectedTournament} onBack={backToList} />
        </div>
      )}
    </div>
  );
}

function TournamentDetails({ tournament, onBack }) {
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

  useEffect(() => {
    fetchRounds();
    fetchPlayers();
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
    
  // ...
  return (
    <div className="text-white">
      {/* Ajouter un joueur */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Ajouter un joueur</h3>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            className="border p-1 rounded"
            placeholder="Nom"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <input
            className="border p-1 rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <ColorDropdown selectedColor={color1} onChange={setColor1} />
          <ColorDropdown selectedColor={color2} onChange={setColor2} />
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={addPlayer} disabled={!playerName.trim()}>
            Ajouter
          </button>
        </div>
      </div>

      {/* Import depuis melee.gg */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Importer depuis melee.gg</h3>
        <div className="flex gap-2 items-center">
          <input
            className="border p-1 rounded w-full"
            placeholder="Lien melee.gg (ex: https://www.melee.gg/Tournament/View/123456)"
            value={meleeUrl}
            onChange={(e) => setMeleeUrl(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={importFromMelee}>
            Importer
          </button>
        </div>
      </div>

      {/* Liste des joueurs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-white">Joueurs du tournoi</h3>
        <table className="w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded overflow-hidden">
          <thead className="bg-[#2a2a2a] text-gray-100 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 border-b border-gray-700">Nom</th>
              <th className="px-4 py-3 border-b border-gray-700">Description</th>
              <th className="px-4 py-3 border-b border-gray-700 text-center">Couleur 1</th>
              <th className="px-4 py-3 border-b border-gray-700 text-center">Couleur 2</th>
              <th className="px-4 py-3 border-b border-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, idx) => {
              const isEditing = editPlayer?.id === p.id;
              return (
                <tr key={p.id} className={idx % 2 === 0 ? 'bg-[#1e1e1e]' : 'bg-[#2a2a2a]'}>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {isEditing ? (
                      <input
                        className="w-full bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                        value={editPlayer.name}
                        onChange={(e) => setEditPlayer({ ...editPlayer, name: e.target.value })}
                      />
                    ) : (
                      p.name
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {isEditing ? (
                      <input
                        className="w-full bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                        value={editPlayer.description || ''}
                        onChange={(e) => setEditPlayer({ ...editPlayer, description: e.target.value })}
                      />
                    ) : (
                      p.description
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-center">
                    {isEditing ? (
                      <select
                        className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                        value={editPlayer.color1 || ''}
                        onChange={(e) => setEditPlayer({ ...editPlayer, color1: e.target.value })}
                      >
                        <option value="">--</option>
                        {Object.keys(colorImages).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    ) : (
                      p.color1 && <img src={colorImages[p.color1]} alt={p.color1} className="w-5 h-5 inline-block rounded" />
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-center">
                    {isEditing ? (
                      <select
                        className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                        value={editPlayer.color2 || ''}
                        onChange={(e) => setEditPlayer({ ...editPlayer, color2: e.target.value })}
                      >
                        <option value="">--</option>
                        {Object.keys(colorImages).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    ) : (
                      p.color2 && <img src={colorImages[p.color2]} alt={p.color2} className="w-5 h-5 inline-block rounded" />
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-center">
                    {isEditing ? (
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded"
                        onClick={() => savePlayer(p.id)}
                      >
                        💾
                      </button>
                    ) : (
                      <button
                        className="text-blue-400 underline"
                        onClick={() => setEditPlayer(p)}
                      >
                        Modifier
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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

      <div className="mt-8 text-center">
        <button onClick={onBack} className="bg-red-500 px-4 py-2 rounded">
          Retour
        </button>
      </div>
    </div>
  );
}
