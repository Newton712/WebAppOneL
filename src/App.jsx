// src/App.jsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import logo from './logo.jpg';
import jauneIcon from './assets/colors/amber.png';
import mauveIcon from './assets/colors/purple.png';
import vertIcon from './assets/colors/emerald.png';
import rougeIcon from './assets/colors/ruby.png';
import bleuIcon from './assets/colors/sapphire.png';
import grisIcon from './assets/colors/steel.png';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const colorOptions = [
  { value: 'jaune', icon: jauneIcon },
  { value: 'mauve', icon: mauveIcon },
  { value: 'vert', icon: vertIcon },
  { value: 'rouge', icon: rougeIcon },
  { value: 'bleu', icon: bleuIcon },
  { value: 'gris', icon: grisIcon },
];

export default function App() {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [newTournamentName, setNewTournamentName] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchTournaments();
  }, []);

  async function fetchTournaments() {
    const { data } = await supabase.from('tournaments').select('*');
    if (data) {
      setTournaments(data);
      setFilteredTournaments(data);
    }
  }

  async function addTournament() {
    if (!newTournamentName.trim()) return;
    const { data } = await supabase
      .from('tournaments')
      .insert({ name: newTournamentName })
      .select()
      .single();
    if (data) {
      setNewTournamentName("");
      setTournaments(prev => [...prev, data]);
      setFilteredTournaments(prev => [...prev, data]);
      setSelectedTournament(data);
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
    <div className="min-h-screen bg-gray-50 p-6 text-center">
      <header className="flex items-center justify-center mb-8 gap-4">
        <img src={logo} alt="Logo" className="h-12 w-12" />
        <h1 className="text-3xl font-bold text-gray-800">Tournois</h1>
      </header>

      {!selectedTournament && (
        <div className="flex flex-col items-center">
          <div className="mb-4 flex gap-2">
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

          <div className="mb-6 flex gap-2">
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
            <table className="w-full max-w-3xl border bg-white shadow-md rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Nom du tournoi</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTournaments.map((tournament) => (
                  <tr key={tournament.id}>
                    <td className="border px-4 py-2">{tournament.name}</td>
                    <td className="border px-4 py-2 text-center">
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
        <div className="max-w-4xl mx-auto">
          <TournamentDetails tournament={selectedTournament} />
          <div className="flex justify-center mt-6">
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={backToList}>
              Retour à la liste
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TournamentDetails({ tournament }) {
  const [rounds, setRounds] = useState([]);
  const [players, setPlayers] = useState([]);
  const [roundNumber, setRoundNumber] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [description, setDescription] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");

  useEffect(() => {
    fetchRounds();
    fetchPlayers();
  }, [tournament]);

  async function fetchRounds() {
    const { data } = await supabase
      .from('rounds')
      .select('*')
      .eq('tournament_id', tournament.id);
    setRounds(data || []);
  }

  async function fetchPlayers() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('tournament_id', tournament.id);
    setPlayers(data || []);
  }

  async function addRound() {
    if (!roundNumber) return;
    await supabase.from('rounds').insert({ tournament_id: tournament.id, number: roundNumber });
    setRoundNumber("");
    fetchRounds();
  }

  async function addPlayer() {
    if (!playerName || !color1 || !color2) return;
    await supabase.from('players').insert({
      tournament_id: tournament.id,
      name: playerName,
      description,
      color1,
      color2
    });
    setPlayerName("");
    setDescription("");
    setColor1("");
    setColor2("");
    fetchPlayers();
  }

  return (
    <div className="mt-6 text-left">
      <h2 className="text-xl font-bold text-center mb-4">Détails du tournoi : {tournament.name}</h2>

      <div className="mb-6">
        <h3 className="font-semibold">Rounds</h3>
        <div className="flex items-center gap-2 mt-2">
          <input className="border p-1 rounded" placeholder="Numéro" value={roundNumber} onChange={(e) => setRoundNumber(e.target.value)} />
          <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={addRound}>Ajouter</button>
        </div>
        <ul className="mt-2 list-disc pl-5">
          {rounds.map(r => <li key={r.id}>Round {r.number}</li>)}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold">Joueurs</h3>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <input className="border p-1 rounded" placeholder="Nom" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          <input className="border p-1 rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

          <select className="border p-1 rounded" value={color1} onChange={(e) => setColor1(e.target.value)}>
            <option value="">Couleur 1</option>
            {colorOptions.map(c => (
              <option key={c.value} value={c.value}>{c.value}</option>
            ))}
          </select>
          {color1 && <img src={colorOptions.find(c => c.value === color1).icon} alt={color1} className="h-6 w-6" />}

          <select className="border p-1 rounded" value={color2} onChange={(e) => setColor2(e.target.value)}>
            <option value="">Couleur 2</option>
            {colorOptions.map(c => (
              <option key={c.value} value={c.value}>{c.value}</option>
            ))}
          </select>
          {color2 && <img src={colorOptions.find(c => c.value === color2).icon} alt={color2} className="h-6 w-6" />}

          <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={addPlayer}>Ajouter</button>
        </div>

        <ul className="mt-2 list-disc pl-5">
          {players.map(p => (
            <li key={p.id}>
              {p.name} – {p.color1} / {p.color2} ({p.description})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
