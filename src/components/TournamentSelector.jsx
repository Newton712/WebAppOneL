import { useState } from 'react';

export default function TournamentSelector({
  newTournamentName,
  setNewTournamentName,
  addTournament,
  searchName,
  setSearchName,
  searchTournament,
  filteredTournaments,
  setSelectedTournament,
  meleeLink,
  setMeleeLink,
  handleImportOrRedirect
}) {
  return (
    <div className="flex flex-col items-center">
      {/* Création de tournoi */}
      <div className="mb-4 flex justify-center gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Nom du nouveau tournoi"
          value={newTournamentName}
          onChange={(e) => setNewTournamentName(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addTournament}>
          Créer
        </button>
      </div>

      {/* URL melee.gg, ajout ou consultation des données */}
      <div className="mb-4 flex gap-2 w-full">
        <input
          className="border p-2 rounded w-full"
          placeholder="Coller un lien melee.gg ici"
          value={meleeLink}
          onChange={(e) => setMeleeLink(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleImportOrRedirect}
        >
          Importer ou Ouvrir
        </button>
      </div>

      {/* Recherche de tournoi */}
      <div className="mb-6 flex justify-center gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Rechercher un tournoi"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={searchTournament}>
          Rechercher
        </button>
      </div>

      {/* Liste des tournois filtrés */}
      {filteredTournaments.length > 0 && (
        <table className="w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded overflow-hidden">
          <thead className="bg-[#2a2a2a] text-gray-100 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 border-b border-gray-700">Nom du tournoi</th>
              <th className="px-4 py-3 border-b border-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTournaments.map((tournament) => (
              <tr key={tournament.id}>
                <td className="border px-4 py-2">{tournament.name}</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-700 underline"
                    onClick={() => setSelectedTournament(tournament)}
                  >
                    Gérer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

