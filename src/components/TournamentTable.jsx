// src/components/TournamentTable.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TournamentTable({ tournaments }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Tournois trouvés</h2>
      <table className="w-full border table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((t) => (
            <tr key={t.tournament_id} className="text-center">
              <td className="p-2 border">{t.tournament_name}</td>
              <td className="p-2 border">{t.tournament_date}</td>
              <td className="p-2 border">
                <button
                  onClick={() => navigate(`/tournament/${t.tournament_id}`)}
                  className="text-blue-600 underline"
                >
                  Consulter
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
