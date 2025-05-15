// components/TournamentDetails.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import RoundsManager from './RoundsManager';

export default function TournamentDetails({ tournament, onBack }) {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [description, setDescription] = useState('');
  const [color1, setColor1] = useState('');
  const [color2, setColor2] = useState('');
  const [meleeUrl, setMeleeUrl] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('tournament_id', tournament.tournament_id);
    setPlayers(data || []);
  }

  async function addPlayer() {
    if (!playerName.trim()) return;

    await supabase.from('players').insert({
      tournament_id: tournament.tournament_id,
      name: playerName.trim(),
      description: description.trim() || null,
      color1: color1 || null,
      color2: color2 || null
    });

    setPlayerName('');
    setDescription('');
    setColor1('');
    setColor2('');
    fetchPlayers();
  }

  async function importFromMelee() {
    const match = meleeUrl.match(/https?:\/\/www\.melee\.gg\/Tournament\/View\/(\d+)/);
    if (!match) return alert("Lien melee.gg invalide");

    const url = `https://www.melee.gg/Tournament/View/${match[1]}`;

    try {
      const response = await fetch(`https://ton-proxy.onrender.com/api/import-melee?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error("Erreur proxy melee.gg");

      fetchPlayers(); // recharger les joueurs
      alert("Import réussi depuis melee.gg");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'import (scraping)");
    }
  }

  return (
    <div className="text-white">
      {/* Ajouter un joueur */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Ajouter un joueur</h3>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            className="border p-1 rounded"
            placeholder="Nom"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <input
            className="border p-1 rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="border p-1 rounded"
            placeholder="Couleur 1"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
          />
          <input
            className="border p-1 rounded"
            placeholder="Couleur 2"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
          />
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={addPlayer} disabled={!playerName.trim()}>
            Ajouter
          </button>
        </div>
      </div>

      {/* Import depuis melee.gg */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Importer depuis melee.gg</h3>
        <div className="flex gap-2 items-center">
          <input
            className="border p-1 rounded w-full"
            placeholder="Lien melee.gg (ex: https://www.melee.gg/Tournament/View/123456)"
            value={meleeUrl}
            onChange={(e) => setMeleeUrl(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={importFromMelee}>
            Importer
          </button>
        </div>
      </div>

      <RoundsManager tournament={tournament} players={players} />

      <div className="mt-8 text-center">
        <button onClick={onBack} className="bg-red-500 px-4 py-2 rounded">
          Retour
        </button>
      </div>
    </div>
  );
}
