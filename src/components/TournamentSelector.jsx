// src/components/TournamentSelector.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TournamentSelector({
  meleeLink,
  setMeleeLink,
  handleImportOrRedirect,
  searchName,
  setSearchName,
  searchTournament,
  filteredTournaments,
  setSelectedTournament,
  playerSearch,
  setPlayerSearch,
  searchPlayers,
  foundPlayers
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 px-6 mt-24 max-w-4xl mx-auto">
      {/* Melee Link Input */}
      <div className="flex items-center gap-4">
        <input
          className="border px-4 py-2 rounded w-full shadow-sm"
          value={meleeLink}
          onChange={(e) => setMeleeLink(e.target.value)}
          placeholder="Lien melee.gg"
        />
        <button
          onClick={handleImportOrRedirect}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Importer ou ouvrir
        </button>
      </div>

      {/* Tournament Search */}
      <div className="flex items-center gap-4">
        <input
          className="border px-4 py-2 rounded w-full shadow-sm"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Rechercher un tournoi"
        />
        <button
          onClick={searchTournament}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Recherche tournoi
        </button>
      </div>

      {/* Player Search */}
      <div className="flex items-center gap-4">
        <input
          className="border px-4 py-2 rounded w-full shadow-sm"
          value={playerSearch}
          onChange={(e) => setPlayerSearch(e.target.value)}
          placeholder="Rechercher un joueur"
        />
        <button
          onClick={searchPlayers}
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
        >
          Recherche joueur
        </button>
      </div>

      {/* Tournament Results */}
      {filteredTournaments.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Tournois trouvés</h2>
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Nom</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTournaments.map((t) => (
                <tr key={t.tournament_id}>
                  <td className="p-2 border">{t.tournament_name}</td>
                  <td className="p-2 border">{t.tournament_date}</td>
                  <td className="p-2 border text-center">
                  <button
                    onClick={() => navigate(`/tournament/${t.tournament_id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
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

      {/* Player Results */}
      {foundPlayers?.length > 0 && (
        <div className="space-y-2 mt-6">
          <h2 className="text-xl font-bold">Joueurs trouvés</h2>
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Nom</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {foundPlayers.map((p) => (
                <tr key={p.id}>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => navigate(`/player/${p.id}`)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
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
