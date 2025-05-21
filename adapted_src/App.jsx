// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import TournamentSelector from './components/TournamentSelector';
import TournamentPage from './routes/TournamentPage';
import PlayerHistory from './routes/PlayerHistory';
import { supabase } from './lib/supabase';

export default function App() {
  const [meleeLink, setMeleeLink] = useState('');
  const [searchName, setSearchName] = useState('');
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [playerSearch, setPlayerSearch] = useState('');
  const [foundPlayers, setFoundPlayers] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);

  const navigate = useNavigate();

  async function handleImportOrRedirect() {
    const match = meleeLink.match(/(\\d+)/);
    if (!match) return alert('Lien invalide');
    const meleeId = match[1];

    const { data: existing } = await supabase
      .from('tournaments')
      .select('*')
      .eq('tournament_id', meleeId)
      .maybeSingle();

    if (existing) {
      setSelectedTournament(existing);
      navigate(`/tournament/${existing.tournament_id}`);
    } else {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/import/all/${meleeId}`, { method: 'POST' });
      if (!res.ok) return alert("Erreur d'import");
      const { data: inserted } = await supabase
        .from('tournaments')
        .select('*')
        .eq('tournament_id', meleeId)
        .maybeSingle();
      if (inserted) navigate(`/tournament/${inserted.tournament_id}`);
    }
  }

  async function searchTournament() {
    const { data } = await supabase
      .from('tournaments')
      .select('*')
      .ilike('tournament_name', `%${searchName}%`);
    setFilteredTournaments(data);
  }

  async function searchPlayers() {
    const { data } = await supabase
      .from('players')
      .select('id, name')
      .ilike('name', `%${playerSearch}%`);
    setFoundPlayers(data);
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <TournamentSelector
            meleeLink={meleeLink}
            setMeleeLink={setMeleeLink}
            handleImportOrRedirect={handleImportOrRedirect}
            searchName={searchName}
            setSearchName={setSearchName}
            searchTournament={searchTournament}
            filteredTournaments={filteredTournaments}
            setSelectedTournament={setSelectedTournament}
            playerSearch={playerSearch}
            setPlayerSearch={setPlayerSearch}
            searchPlayers={searchPlayers}
            foundPlayers={foundPlayers}
          />
        }
      />
      <Route path="/tournament/:id" element={<TournamentPage />} />
      <Route path="/player/:id" element={<PlayerHistory />} />
    </Routes>
  );
}
