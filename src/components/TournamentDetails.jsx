// src/components/TournamentDetails.jsx
import React from 'react';
import RoundTable from './RoundTable';

export default function TournamentDetails({ pairings, round, reload }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Round {round}</h2>
      <RoundTable pairings={pairings} round={round} reload={reload} />
    </div>
  );
}
