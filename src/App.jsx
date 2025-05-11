// src/App.jsx
import './index.css';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import TournamentDetails from './components/TournamentDetails';
import TournamentSelector from './components/TournamentSelector';

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

async function handleImportOrRedirect() {
  const match = meleeLink.match(/\/Tournament\/View\/(\d+)/);
  if (!match) {
    alert("Lien invalide");
    return;
  }

  const meleeId = match[1];

  const { data: existing } = await supabase
    .from('tournaments')
    .select('*')
    .eq('melee_id', meleeId)
    .maybeSingle();

  if (existing) {
    setSelectedTournament(existing);
    return;
  }

  try {
    const response = await fetch(`/api/fetch-melee?meleeId=${meleeId}`);
    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || "Erreur scraping");
    }

    const { title, players, matches } = result;

    const { data: newTournament } = await supabase
      .from('tournaments')
      .insert({ name: title, melee_id: meleeId })
      .select()
      .single();

    const playerMap = new Map();
    for (const player of players) {
      const { data: inserted } = await supabase
        .from('players')
        .insert({
          tournament_id: newTournament.id,
          name: player.name,
        })
        .select()
        .single();
      playerMap.set(player.name, inserted.id);
    }

    const { data: round } = await supabase
      .from('rounds')
      .insert({
        tournament_id: newTournament.id,
        number: 1,
        name: 'Round 1'
      })
      .select()
      .single();

    const tables = matches.map((m, i) => ({
      round_id: round.id,
      player1_id: playerMap.get(m.player1),
      player2_id: playerMap.get(m.player2),
      number: i + 1
    }));

    await supabase.from('tables').insert(tables);

    setSelectedTournament(newTournament);
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'import.");
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
        <TournamentSelector
          newTournamentName={newTournamentName}
          setNewTournamentName={setNewTournamentName}
          addTournament={addTournament}
          searchName={searchName}
          setSearchName={setSearchName}
          searchTournament={searchTournament}
          filteredTournaments={filteredTournaments}
          setSelectedTournament={setSelectedTournament}
          meleeLink={meleeLink}
          setMeleeLink={setMeleeLink}
          handleImportOrRedirect={handleImportOrRedirect}
        />
      )}

      {selectedTournament && (
        <div className="max-w-6xl mx-auto">
          <TournamentDetails tournament={selectedTournament} onBack={backToList} />
        </div>
      )}
    </div>
  );
}
