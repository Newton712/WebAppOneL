// src/routes/TournamentPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlayersList from '../components/PlayersList';
import RoundsManager from '../components/RoundsManager';
import { supabase } from '../lib/supabase';
import logo from '../assets/logo.png';

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

  if (!tournament) return <p className="text-white p-6">Chargement...</p>;

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white">
      <header className="sticky top-0 bg-[#111] z-10 shadow-md flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div>
          <h1 className="text-xl font-bold">{tournament.tournament_name}</h1>
          <p className="text-sm text-gray-400">
            ID: {tournament.tournament_id} — {tournament.tournament_date}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retour accueil
          </button>
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>
      </header>

      <main className="p-6 space-y-8">
        <PlayersList tournamentId={id} players={players} reload={fetchPlayers} />

        <RoundsManager
          tournamentId={id}
          pairings={pairings}
          selectedRound={selectedRound}
          onRoundChange={setSelectedRound}
          reload={fetchPairings}
        />
      </main>
    </div>
  );
}
