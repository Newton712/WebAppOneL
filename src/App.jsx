// src/App.jsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tournois</h1>

      {!selectedTournament && (
        <>
          <div className="mb-4">
            <input
              className="border p-2 mr-2"
              placeholder="Nom du nouveau tournoi"
              value={newTournamentName}
              onChange={(e) => setNewTournamentName(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2" onClick={addTournament}>
              Créer
            </button>
          </div>

          <div className="mb-4">
            <input
              className="border p-2 mr-2"
              placeholder="Rechercher un tournoi"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <button className="bg-gray-500 text-white px-4 py-2" onClick={searchTournament}>
              Rechercher
            </button>
          </div>

          {filteredTournaments.length > 0 ? (
            <table className="w-full border mt-4">
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
          ) : (
            <p className="mt-4 text-gray-600">Aucun tournoi trouvé.</p>
          )}
        </>
      )}

      {selectedTournament && (
        <>
          <TournamentDetails tournament={selectedTournament} />
          <button className="mt-4 bg-red-500 text-white px-4 py-2" onClick={backToList}>
            Retour à la liste
          </button>
        </>
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
      <h2 className="text-xl font-bold">Détails du tournoi : {tournament.name}</h2>

      <div className="mt-4">
        <h3 className="font-semibold">Rounds</h3>
        <input className="border p-1 mr-2" placeholder="Numéro" value={roundNumber} onChange={(e) => setRoundNumber(e.target.value)} />
        <button className="bg-green-500 text-white px-2 py-1" onClick={addRound}>Ajouter</button>
        <ul className="mt-2">
          {rounds.map(r => <li key={r.id}>Round {r.number}</li>)}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Joueurs</h3>
        <input className="border p-1 mr-2" placeholder="Nom" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        <input className="border p-1 mr-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="border p-1 mr-2" placeholder="Couleur 1" value={color1} onChange={(e) => setColor1(e.target.value)} />
        <input className="border p-1 mr-2" placeholder="Couleur 2" value={color2} onChange={(e) => setColor2(e.target.value)} />
        <button className="bg-green-500 text-white px-2 py-1" onClick={addPlayer}>Ajouter</button>
        <ul className="mt-2">
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
