// src/components/TournamentSelector.jsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function TournamentSelector() {
  const [meleeLink, setMeleeLink] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchPlayer, setSearchPlayer] = useState('');
  const [tournamentResults, setTournamentResults] = useState([]);
  const [playerResults, setPlayerResults] = useState([]);

  const navigate = useNavigate();

  async function handleImportOrOpen() {
    const match = meleeLink.match(/\/Tournament\/View\/(\d+)/);
    if (!match) {
      alert("Lien Melee invalide");
      return;
    }
    const meleeId = match[1];

    const { data: existing } = await supabase
      .from('tournaments')
      .select('*')
      .eq('tournament_id', meleeId)
      .maybeSingle();

    if (existing) {
      navigate(`/tournament/${meleeId}`);
    } else {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/import/all/${meleeId}`, {
        method: 'POST'
      });
      if (res.ok) navigate(`/tournament/${meleeId}`);
      else alert("Erreur lors de l'import");
    }
  }

  async function searchTournaments() {
    const { data } = await supabase
      .from('tournaments')
      .select('*')
      .ilike('tournament_name', `%${searchName}%`);
    setTournamentResults(data || []);
  }

  async function searchPlayers() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .ilike('name', `%${searchPlayer}%`);
    setPlayerResults(data || []);
  }

  return (
    <div className="space-y-6">
      <header className="bg-white sticky top-0 z-10 shadow-md p-4 space-y-4">
        <div className="flex gap-4">
          <input
            placeholder="Lien Melee.gg"
            value={meleeLink}
            onChange={e => setMeleeLink(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={handleImportOrOpen}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Importer / Ouvrir
          </button>
        </div>
        <div className="flex gap-4">
          <input
            placeholder="Nom du tournoi"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={searchTournaments}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Rechercher Tournoi
          </button>
        </div>
        <div className="flex gap-4">
          <input
            placeholder="Nom du joueur"
            value={searchPlayer}
            onChange={e => setSearchPlayer(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={searchPlayers}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Rechercher Joueur
          </button>
        </div>
      </header>

      {tournamentResults.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-2">Tournois trouvés :</h2>
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Nom</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {tournamentResults.map(t => (
                <tr key={t.tournament_id}>
                  <td className="border p-2">{t.tournament_name}</td>
                  <td className="border p-2">{t.tournament_date}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => navigate(`/tournament/${t.tournament_id}`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Consulter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {playerResults.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-2">Joueurs trouvés :</h2>
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Nom</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {playerResults.map(p => (
                <tr key={p.id}>
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => navigate(`/player/${p.name}`)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded"
                    >
                      Historique
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
