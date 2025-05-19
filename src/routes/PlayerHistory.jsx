// src/routes/PlayerHistory.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function PlayerHistory() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, [name]);

  async function fetchHistory() {
    const { data } = await supabase
      .from('players')
      .select('tournament_id, name, Deckcolor1, Deckcolor2, tournaments(tournament_name, tournament_date)')
      .eq('name', name)
      .order('tournaments.tournament_date', { ascending: false });

    setHistory(data || []);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white z-10 border-b shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Historique de {name}</h1>
        <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">
          Retour accueil
        </button>
      </div>

      <div className="p-4 space-y-4">
        {history.map((entry, idx) => (
          <div key={idx} className="border p-4 rounded shadow">
            <p><strong>Tournoi:</strong> {entry.tournaments?.tournament_name}</p>
            <p><strong>Date:</strong> {entry.tournaments?.tournament_date}</p>
            <p><strong>Deck:</strong> {entry.Deckcolor1} / {entry.Deckcolor2}</p>
          </div>
        ))}
        {history.length === 0 && <p>Aucune participation trouvée.</p>}
      </div>
    </div>
  );
}
