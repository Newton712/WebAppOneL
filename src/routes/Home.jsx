// src/routes/Home.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import TournamentTable from '../components/TournamentTable';
import PlayerTable from '../components/PlayerTable';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [tournamentResults, setTournamentResults] = useState([]);
  const [playerResults, setPlayerResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSearchTournaments(name) {
    setLoading(true);
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .ilike('tournament_name', `%${name}%`);
    setTournamentResults(data || []);
    setLoading(false);
  }

  async function handleSearchPlayers(name) {
    setLoading(true);
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .ilike('name', `%${name}%`);
    setPlayerResults(data || []);
    setLoading(false);
  }

  async function handleImportOrOpen(link) {
    const match = link.match(/\/Tournament\/View\/(\d+)/);
    if (!match) return alert('Lien Melee invalide');
    const meleeId = match[1];

    const { data: existing } = await supabase
      .from('tournaments')
      .select('*')
      .eq('tournament_id', meleeId)
      .maybeSingle();

    if (existing) navigate(`/tournament/${meleeId}`);
    else {
      await fetch(`${import.meta.env.VITE_API_URL}/import/all/${meleeId}`, {
        method: 'POST',
      });
      navigate(`/tournament/${meleeId}`);
    }
  }

  return (
    <div className="min-h-screen bg-melee text-white">
      <Header
        onImportOrOpen={handleImportOrOpen}
        onSearchTournaments={handleSearchTournaments}
        onSearchPlayers={handleSearchPlayers}
      />

      <div className="px-4 mt-24 space-y-8">
        {loading && <p>Chargement...</p>}
        {tournamentResults.length > 0 && (
          <TournamentTable tournaments={tournamentResults} />
        )}

        {playerResults.length > 0 && (
          <PlayerTable players={playerResults} />
        )}
      </div>
    </div>
  );
}
