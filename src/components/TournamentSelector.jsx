// src/components/TournamentSelector.jsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function TournamentSelector() {
  const [meleeLink, setMeleeLink] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchPlayer, setSearchPlayer] = useState('');
  const [tournamentResults, setTournamentResults] = useState([]);
  const [playerResults, setPlayerResults] = useState([]);

  const navigate = useNavigate();

  async function handleImportOrOpen() {
    const match = meleeLink.match(/\/Tournament\/View\/(\d+)/);
    if (!match) return alert("Lien Melee invalide");
    const meleeId = match[1];

    const { data: existing } = await supabase
      .from('tournaments')
      .select('*')
      .eq('tournament_id', meleeId)
      .maybeSingle();

    if (existing) {
      navigate(`/tournament/${meleeId}`);
    } else {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/import/all/${meleeId}`, { method: 'POST' });
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
      .select('name')
      .ilike('name', `%${searchPlayer}%`);

    const uniqueNames = Array.from(new Set(data.map(p => p.name.toLowerCase())))
      .map(lower => data.find(p => p.name.toLowerCase() === lower)?.name)
      .sort((a, b) => a.localeCompare(b));

    setPlayerResults(uniqueNames.map(name => ({ name })));
  }

  return (
    <div className="mb-6 bg-[#1e1e1e] text-white min-h-screen">
      <header className="bg-[#2a2a2a] p-4 shadow flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Suivi Tournois</h1>
        <img src={logo} alt="Logo" className="h-12" />
      </header>

      <div className="p-6 space-y-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <input
            placeholder="Lien Melee.gg"
            value={meleeLink}
            onChange={e => setMeleeLink(e.target.value)}
            className="border border-gray-600 px-4 py-2 rounded w-full bg-[#1e1e1e] text-white"
          />
          <button
            onClick={handleImportOrOpen}
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Importer / Ouvrir
          </button>
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <input
            placeholder="Nom du tournoi"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            className="border border-gray-600 px-4 py-2 rounded w-full bg-[#1e1e1e] text-white"
          />
          <button
            onClick={searchTournaments}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Rechercher Tournoi
          </button>
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <input
            placeholder="Nom du joueur"
            value={searchPlayer}
            onChange={e => setSearchPlayer(e.target.value)}
            className="border border-gray-600 px-4 py-2 rounded w-full bg-[#1e1e1e] text-white"
          />
          <button
            onClick={searchPlayers}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Rechercher Joueur
          </button>
        </div>
      </div>

      {tournamentResults.length > 0 && (
        <div className="px-6">
          <h2 className="font-semibold text-lg mb-2 text-gray-300">Tournois trouvés :</h2>
          <table className="w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded overflow-hidden">
            <thead className="bg-[#2a2a2a] text-gray-100 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 border-b border-gray-700">Nom</th>
                <th className="px-4 py-3 border-b border-gray-700">Date</th>
                <th className="px-4 py-3 border-b border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {tournamentResults.map(t => (
                <tr key={t.tournament_id}>
                  <td className="px-4 py-3 border-b border-gray-700">{t.tournament_name}</td>
                  <td className="px-4 py-3 border-b border-gray-700">{t.tournament_date}</td>
                  <td className="px-4 py-3 border-b border-gray-700">
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
        <div className="px-6 mt-6">
          <h2 className="font-semibold text-lg mb-2 text-gray-300">Joueurs trouvés :</h2>
          <table className="w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded overflow-hidden">
            <thead className="bg-[#2a2a2a] text-gray-100 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 border-b border-gray-700">Nom</th>
                <th className="px-4 py-3 border-b border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {playerResults.map(p => (
                <tr key={p.name}>
                  <td className="px-4 py-3 border-b border-gray-700">{p.name}</td>
                  <td className="px-4 py-3 border-b border-gray-700">
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
