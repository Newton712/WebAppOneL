// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import TournamentSelector from '../components/TournamentSelector';
import TournamentDetails from '../components/TournamentDetails';
import RoundTable from '../components/RoundTable';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [tournament, setTournament] = useState(null);
  const [pairings, setPairings] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (tournament) {
      fetchPairings(tournament.tournament_id);
      fetchPlayers(tournament.tournament_id);
    }
  }, [tournament]);

  const fetchPairings = async (tournamentId) => {
    const { data, error } = await supabase
      .from('pairings')
      .select('*')
      .eq('tournament_id', tournamentId);
    if (!error && data.length) {
      setPairings(data);
      const roundNumbers = [...new Set(data.map(p => parseInt(p.round.match(/\d+/))))].sort((a, b) => a - b);
      const roundLabels = roundNumbers.map(n => `Round ${n}`);
      setRounds(roundLabels);
      setSelectedRound(roundLabels[0]);
    }
  };

  const fetchPlayers = async (tournamentId) => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('name', { ascending: true });
    if (!error) {
      setPlayers(data);
    }
  };

  const handleSelectTournament = (t) => {
    setTournament(t);
  };

  return (
    <main className="min-h-screen bg-meleeDark text-white">
      <div className="p-6">
        {!tournament ? (
          <TournamentSelector onSelect={handleSelectTournament} />
        ) : (
          <>
            <TournamentDetails
              tournament={tournament}
              players={players}
              refreshPlayers={() => fetchPlayers(tournament.tournament_id)}
            />
            {rounds.length > 0 && (
              <div className="my-4 flex gap-2">
                {rounds.map(round => (
                  <button
                    key={round}
                    className={`px-4 py-2 rounded ${selectedRound === round ? 'bg-blue-600' : 'bg-gray-700'}`}
                    onClick={() => setSelectedRound(round)}
                  >
                    {round}
                  </button>
                ))}
              </div>
            )}
            {selectedRound && (
              <RoundTable
                tournamentId={tournament.tournament_id}
                round={selectedRound}
                pairings={pairings.filter(p => p.round === selectedRound)}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
