import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function RoundsManager({ tournamentId }) {
  const [rounds, setRounds] = useState([]);
  const [activeRound, setActiveRound] = useState('');
  const [pairings, setPairings] = useState([]);
  const [edited, setEdited] = useState({});

  useEffect(() => {
    fetchRounds();
  }, [tournamentId]);

  async function fetchRounds() {
    const { data, error } = await supabase
      .from('pairings')
      .select('round')
      .eq('tournament_id', tournamentId);

    console.log("🎯 fetchRounds data:", data);
    console.log("❌ fetchRounds error:", error);

    const uniqueRounds = [...new Set(data.map(p => p.round))];
    setRounds(uniqueRounds);
    if (uniqueRounds.length > 0) {
      setActiveRound(uniqueRounds[0]);
    }
  }

  useEffect(() => {
    if (activeRound) fetchPairings();
  }, [activeRound]);

  async function fetchPairings() {
    const { data, error } = await supabase
      .from('pairings')
      .select('*')
      .eq('tournament_id', tournamentId)
      .eq('round', activeRound);

    console.log("📦 Pairings for round:", activeRound, data);
    if (error) console.error("❌ Error loading pairings:", error);
    setPairings(data || []);
  }

  function updateField(id, field, value) {
    setEdited(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  async function savePairing(id) {
    const updates = edited[id];
    if (updates) {
      await supabase.from('pairings').update(updates).eq('id', id);
      setEdited(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      fetchPairings();
    }
  }

  async function importTables() {
    await fetch(`${import.meta.env.VITE_API_URL}/import/tables/${tournamentId}`, {
      method: 'POST'
    });
    fetchRounds();
    fetchPairings();
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex gap-2">
        {rounds.map(round => (
          <button
            key={round}
            onClick={() => setActiveRound(round)}
            className={`px-3 py-1 rounded ${activeRound === round ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {round}
          </button>
        ))}
        <button
          onClick={importTables}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          ➕ Importer
        </button>
      </div>
      {/* Vérifie si pairings contient bien des données */}
      {pairings?.length > 0 ? (
         <div className="text-white">Infos a afficher.</div>
      ) : (
      <div className="text-white">Aucune table à afficher pour ce round.</div>
    )}
    </div>
  );
}
