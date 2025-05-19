// src/components/Header.jsx
import React, { useState } from 'react';

export default function Header({ onImportOrOpen, onSearchTournaments, onSearchPlayers }) {
  const [meleeLink, setMeleeLink] = useState('');
  const [tournamentName, setTournamentName] = useState('');
  const [playerName, setPlayerName] = useState('');

  return (
    <header className="fixed top-0 w-full bg-white shadow z-10 p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <input
          className="flex-1 border px-3 py-2 rounded"
          type="text"
          placeholder="Lien Melee.gg"
          value={meleeLink}
          onChange={(e) => setMeleeLink(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => onImportOrOpen(meleeLink)}
        >
          Importer ou ouvrir
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <input
          className="flex-1 border px-3 py-2 rounded"
          type="text"
          placeholder="Rechercher un tournoi"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => onSearchTournaments(tournamentName)}
        >
          Recherche tournoi
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <input
          className="flex-1 border px-3 py-2 rounded"
          type="text"
          placeholder="Rechercher un joueur"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={() => onSearchPlayers(playerName)}
        >
          Recherche joueur
        </button>
      </div>
    </header>
  );
}
