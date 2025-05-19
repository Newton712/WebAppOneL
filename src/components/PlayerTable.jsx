// src/components/PlayerTable.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlayerTable({ players }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Joueurs trouvés</h2>
      <table className="w-full border table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, idx) => (
            <tr key={idx} className="text-center">
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">
                <button
                  onClick={() => navigate(`/player/${p.name}`)}
                  className="text-purple-600 underline"
                >
                  Historique
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
