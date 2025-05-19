// src/routes/TournamentPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TournamentDetails from '../components/TournamentDetails';
import PlayersList from '../components/PlayersList';
import RoundsTabs from '../components/RoundsTabs';
import { supabase } from '../lib/supabase';

export default function TournamentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [selectedRound, setSelectedRound] = useState('');

  useEffect(() => {
    fetchTournament();
    fetchPlayers();
    fetchPairings();
  }, [id]);

  async function fetchTournament() {
    const { data } = await supabase.from('tournaments').select('*').eq('tournament_id', id).maybeSingle();
    setTournament(data);
  }

  async function fetchPlayers() {
    const { data } = await supabase.from('players').select('*').eq('tournament_id', id);
    setPlayers(data || []);
  }

  async function fetchPairings() {
    const { data } = await supabase.from('pairings').select('*').eq('tournament_id', id);
    setPairings(data || []);
    if (data?.length > 0) setSelectedRound(data[0].round);
  }

  async function handleImportTables() {
    await fetch(`${import.meta.env.VITE_API_URL}/import/tables/${id}`, { method: 'POST' });
    fetchPairings();
  }

  if (!tournament) return <p className="p-4">Chargement...</p>;

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white z-10 border-b shadow p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">{tournament.tournament_name}</h1>
          <p className="text-sm text-gray-600">ID: {tournament.tournament_id} - {tournament.tournament_date}</p>
        </div>
        <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">
          Retour accueil
        </button>
      </div>

      <div className="p-4">
        <PlayersList tournamentId={id} players={players} reload={fetchPlayers} />

        <div className="mt-10">
          <RoundsTabs
            pairings={pairings}
            selectedRound={selectedRound}
            onSelectRound={setSelectedRound}
            onImport={handleImportTables}
          />
        </div>
      </div>
    </div>
  );
}
