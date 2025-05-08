// src/App.jsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import logo from './Logo.jpg';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex items-center mb-8">
        <img src={logo} alt="Logo" className="h-12 w-12 mr-4" />
        <h1 className="text-3xl font-bold text-gray-800">Tournois</h1>
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
    setRounds(data);
  }

  async function fetchPlayers() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('tournament_id', tournament.id);
    setPlayers(data);
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
    <div className="mt-6">
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
        <div className="flex flex-wrap gap-2 mt-2">
          <input className="border p-1 rounded" placeholder="Nom" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          <input className="border p-1 rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="border p-1 rounded" placeholder="Couleur 1" value={color1} onChange={(e) => setColor1(e.target.value)} />
          <input className="border p-1 rounded" placeholder="Couleur 2" value={color2} onChange={(e) => setColor2(e.target.value)} />
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
