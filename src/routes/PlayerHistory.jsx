// src/pages/PlayerHistory.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function PlayerHistory() {
  const { playerName } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (playerName) {
      fetchHistory();
    }
  }, [playerName]);

  async function fetchHistory() {
    const { data } = await supabase
      .from('players')
      .select('tournament_id, name, Deckcolor1, Deckcolor2, tournaments(tournament_name, tournament_date)')
      .ilike('name', playerName)
      .order('tournaments.tournament_date', { ascending: false });

    setHistory(data);
  }

  return (
    <div className="p-6">
      <header className="bg-white sticky top-0 z-10 shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">{playerName}</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retour accueil
        </button>
      </header>

      {history.length === 0 ? (
        <p className="mt-4 text-gray-500">Aucune donnée trouvée.</p>
      ) : (
        <table className="w-full mt-4 table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Tournoi</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Deck 1</th>
              <th className="p-2 border">Deck 2</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{row.tournaments?.tournament_name || ''}</td>
                <td className="p-2 border">{row.tournaments?.tournament_date || ''}</td>
                <td className="p-2 border">{row.Deckcolor1}</td>
                <td className="p-2 border">{row.Deckcolor2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
