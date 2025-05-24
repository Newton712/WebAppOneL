// src/pages/PlayerHistory.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import jaune from '../assets/colors/jaune.png';
import mauve from '../assets/colors/mauve.png';
import vert from '../assets/colors/vert.png';
import rouge from '../assets/colors/rouge.png';
import bleu from '../assets/colors/bleu.png';
import gris from '../assets/colors/gris.png';

const colorImages = { jaune, mauve, vert, rouge, bleu, gris };

export default function PlayerHistory() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (name) fetchHistory();
  }, [name]);

  async function fetchHistory() {
    const { data, error } = await supabase
      .from('players')
      .select(`
        tournament_id,
        name,
        deckcolor1,
        deckcolor2,
        comments,
        tournaments (
          tournament_name,
          tournament_date
        )
      `)
      .eq('name', name);

    if (error) {
      console.error('❌ Error fetching history:', error);
    } else {
      const sorted = data.sort((a, b) => {
        const d1 = new Date(a.tournaments?.tournament_date || '');
        const d2 = new Date(b.tournaments?.tournament_date || '');
        return d2 - d1;
      });
      setHistory(sorted);
    }
  }

  return (
    <div className="p-6 text-white bg-[#1e1e1e] min-h-screen">
      <header className="sticky top-0 z-10 bg-[#2a2a2a] shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{name}</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retour accueil
        </button>
      </header>

      {history.length === 0 ? (
        <p className="mt-4 text-gray-400">Aucune donnée trouvée.</p>
      ) : (
        <table className="w-full mt-6 text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded overflow-hidden">
          <thead className="bg-[#2a2a2a] text-gray-100 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 border-b">Tournoi</th>
              <th className="px-4 py-3 border-b">Date</th>
              <th className="px-4 py-3 border-b text-center">Couleurs</th>
              <th className="px-4 py-3 border-b">Commentaires</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-[#1e1e1e]' : 'bg-[#2a2a2a]'}>
                <td className="px-4 py-2 border-b border-gray-700">
                  {row.tournaments?.tournament_name || ''}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {row.tournaments?.tournament_date || ''}
                </td>
                <td className="px-4 py-2 border-b border-gray-700 text-center">
                  {row.deckcolor1 && <img src={colorImages[row.deckcolor1]} alt={row.deckcolor1} className="w-5 h-5 inline-block rounded mr-1" />}
                  {row.deckcolor2 && <img src={colorImages[row.deckcolor2]} alt={row.deckcolor2} className="w-5 h-5 inline-block rounded" />}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">{row.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
