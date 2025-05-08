import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [newTournamentName, setNewTournamentName] = useState("");

  useEffect(() => {
    fetchTournaments();
  }, []);

  async function fetchTournaments() {
    const { data, error } = await supabase.from('tournaments').select('*');
    if (!error) setTournaments(data);
  }

  async function addTournament() {
    if (!newTournamentName.trim()) return;
    const { error } = await supabase.from('tournaments').insert({ name: newTournamentName });
    if (!error) {
      setNewTournamentName("");
      fetchTournaments();
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tournois</h1>
      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Nom du tournoi"
          value={newTournamentName}
          onChange={(e) => setNewTournamentName(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={addTournament}>Créer</button>
      </div>
      <ul>
        {tournaments.map((t) => (
          <li key={t.id}>
            <button className="text-blue-700 underline" onClick={() => setSelectedTournament(t)}>
              {t.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedTournament && <TournamentDetails tournament={selectedTournament} />}
    </div>
  );
}

function TournamentDetails({ tournament }) {
  const [rounds, setRounds] = useState([]);
  const [players, setPlayers] = useState([]);
  const [tables, setTables] = useState([]);
  const [roundNumber, setRoundNumber] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [description, setDescription] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState(null);
  const [tablePlayer1, setTablePlayer1] = useState("");
  const [tablePlayer2, setTablePlayer2] = useState("");

  useEffect(() => {
    fetchRounds();
    fetchPlayers();
  }, [tournament]);

  useEffect(() => {
    if (selectedRoundId) {
      fetchTables(selectedRoundId);
    }
  }, [selectedRoundId]);

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

  async function fetchTables(roundId) {
    const { data } = await supabase
      .from('tables')
      .select('*')
      .eq('round_id', roundId);
    setTables(data);
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

  async function addTable() {
    if (!selectedRoundId || !tablePlayer1 || !tablePlayer2) return;
    await supabase.from('tables').insert({
      round_id: selectedRoundId,
      player1_id: tablePlayer1,
      player2_id: tablePlayer2
    });
    setTablePlayer1("");
    setTablePlayer2("");
    fetchTables(selectedRoundId);
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Tournoi : {tournament.name}</h2>

      {/* Rounds */}
      <div className="mt-4">
        <h3 className="font-semibold">Rounds</h3>
        <input className="border p-1 mr-2" placeholder="Numéro" value={roundNumber} onChange={(e) => setRoundNumber(e.target.value)} />
        <button className="bg-green-500 text-white px-2 py-1" onClick={addRound}>Ajouter</button>
        <ul className="mt-2">
          {rounds.map(r => (
            <li key={r.id}>
              <button className="text-blue-700 underline" onClick={() => setSelectedRoundId(r.id)}>
                Round {r.number}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tables du round sélectionné */}
      {selectedRoundId && (
        <div className="mt-4">
          <h3 className="font-semibold">Tables du round sélectionné</h3>
          <select className="border p-1 mr-2" value={tablePlayer1} onChange={(e) => setTablePlayer1(e.target.value)}>
            <option value="">Joueur 1</option>
            {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="border p-1 mr-2" value={tablePlayer2} onChange={(e) => setTablePlayer2(e.target.value)}>
            <option value="">Joueur 2</option>
            {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="bg-green-500 text-white px-2 py-1" onClick={addTable}>Ajouter Table</button>
          <ul className="mt-2">
            {tables.map(t => (
              <li key={t.id}>
                Table {t.id} – {players.find(p => p.id === t.player1_id)?.name} vs {players.find(p => p.id === t.player2_id)?.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Joueurs */}
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

