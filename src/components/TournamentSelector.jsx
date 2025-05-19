// src/components/TournamentSelector.jsx
import React from 'react';

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
  searchPlayers
}) {
  return (
    <div className="space-y-4 px-4 mt-20">
      <div className="flex items-center space-x-2">
        <input
          className="border px-2 py-1 rounded w-full"
          value={meleeLink}
          onChange={(e) => setMeleeLink(e.target.value)}
          placeholder="Lien melee.gg"
        />
        <button
          onClick={handleImportOrRedirect}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Importer ou ouvrir
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <input
          className="border px-2 py-1 rounded w-full"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Rechercher un tournoi"
        />
        <button
          onClick={searchTournament}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Recherche tournoi
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <input
          className="border px-2 py-1 rounded w-full"
          value={playerSearch}
          onChange={(e) => setPlayerSearch(e.target.value)}
          placeholder="Rechercher un joueur"
        />
        <button
          onClick={searchPlayers}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Recherche joueur
        </button>
      </div>

      <div className="space-y-2">
        {filteredTournaments.map((t) => (
          <div key={t.tournament_id} className="flex justify-between items-center border p-2 rounded">
            <div>
              <strong>{t.tournament_name}</strong> <span className="text-sm text-gray-500">{t.tournament_date}</span>
            </div>
            <button
              onClick={() => setSelectedTournament(t)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Consulter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
