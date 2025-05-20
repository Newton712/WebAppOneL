// src/pages/Home.jsx
import React from 'react';
import TournamentSelector from '../components/TournamentSelector';

export default function Home() {
  return (
    <main className="min-h-screen bg-meleeDark text-white">
      <div className="p-6">
        <TournamentSelector />
      </div>
    </main>
  );
}
