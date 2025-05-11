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
    alert("Lien melee.gg invalide");
    return;
  }

  const meleeId = match[1];

  // Vérifie si le tournoi existe déjà via meleeId
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
    if (!response.ok) throw new Error("Erreur proxy melee");

    const { title, players, matches } = await response.json();

    // Crée le tournoi
    const { data: tournament, error: tError } = await supabase
      .from('tournaments')
      .insert({ name: title || `Import ${meleeId}`, melee_id: meleeId })
      .select()
      .single();

    if (tError) throw new Error("Erreur création tournoi");

    // Crée les joueurs
    const playerInserts = players.map(p => ({
      name: p.name,
      tournament_id: tournament.id,
      description: '',
      color1: '',
      color2: ''
    }));
    const { data: insertedPlayers } = await supabase
      .from('players')
      .insert(playerInserts)
      .select();

    // Crée un round par défaut
    const { data: round } = await supabase
      .from('rounds')
      .insert({ tournament_id: tournament.id, number: 1, name: 'Round 1' })
      .select()
      .single();

    // Crée les tables (matchs)
    const playersMap = {};
    insertedPlayers.forEach(p => { playersMap[p.name] = p.id });

    const tableInserts = matches.map((m, i) => ({
      round_id: round.id,
      player1_id: playersMap[m.player1] || null,
      player2_id: playersMap[m.player2] || null,
      color1_player1: '',
      color2_player1: '',
      color1_player2: '',
      color2_player2: '',
      table_color1: '',
      table_color2: '',
      table_color3: '',
      table_color4: '',
      number: i + 1
    }));

    await supabase.from('tables').insert(tableInserts);

    fetchTournaments();
    setSelectedTournament(tournament);
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'import depuis melee.gg");
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
