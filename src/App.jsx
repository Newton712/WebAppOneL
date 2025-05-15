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
  const newTournament = {
    tournament_id: crypto.randomUUID(), // ou ton propre identifiant
    tournament_name: newTournamentName,
    tournament_date: new Date().toISOString(), // à adapter si nécessaire
  };

  const { data, error } = await supabase
    .from('tournaments')
    .insert(newTournament)
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
  const apiUrl = import.meta.env.VITE_API_URL;

  const res = await fetch(`${apiUrl}/import/all`, {
    method: "POST",
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Erreur lors de l'import complet : ${msg}`);
  }

  const { data: inserted } = await supabase
    .from('tournaments')
    .select('*')
    .eq('melee_id', meleeId)
    .maybeSingle();

  if (inserted) {
    setSelectedTournament(inserted);
  } else {
    throw new Error("Le tournoi n'a pas été retrouvé dans Supabase après import.");
  }
} catch (err) {
  console.error("Erreur lors de l'import : ", err);
  alert("Erreur lors de l'import automatique depuis la VM.");
}

}





 function searchTournament() {
  const filtered = tournaments.filter(t =>
    t.tournament_name.toLowerCase().includes(searchName.trim().toLowerCase())
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
