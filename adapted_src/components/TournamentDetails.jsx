// src/components/TournamentDetails.jsx
import React from 'react';
import PlayersList from './PlayersList';
import RoundsManager from './RoundsManager';
import { useNavigate } from 'react-router-dom';

export default function TournamentDetails({ tournament, onBack }) {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <header className="bg-gray-100 p-4 rounded flex justify-between items-center sticky top-0 z-10 shadow">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{tournament.tournament_name}</h1>
          <p className="text-sm text-gray-600">
            ID: {tournament.tournament_id} • Date: {tournament.tournament_date}
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retour accueil
        </button>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-2">Joueurs</h2>
        <PlayersList tournamentId={tournament.tournament_id} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Matchs</h2>
        <RoundsManager
          tournamentId={tournament.tournament_id}
          meleeId={tournament.tournament_id}
        />
      </section>
    </div>
  );
}
