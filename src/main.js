// Ce fichier est le point d'entrée d'une application React avec gestion de tournois.
// On utilisera Supabase pour la base de données et les appels API

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [tournaments, setTournaments] = useState([]);
  const [newTournamentName, setNewTournamentName] = useState("");

  useEffect(() => {
    fetchTournaments();
  }, []);

  async function fetchTournaments() {
    const { data, error } = await supabase.from('tournaments').select('*');
    if (error) console.error(error);
    else setTournaments(data);
  }

  async function addTournament() {
    if (!newTournamentName.trim()) return;
    const { data, error } = await supabase.from('tournaments').insert({ name: newTournamentName });
    if (error) console.error(error);
    else {
      setNewTournamentName("");
      fetchTournaments();
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Tournois</h1>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Nom du tournoi"
          value={newTournamentName}
          onChange={(e) => setNewTournamentName(e.target.value)}
        />
        <Button onClick={addTournament}>Ajouter</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournaments.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">{t.name}</h2>
              <p className="text-sm text-gray-500">ID: {t.id}</p>
              {/* Lien vers détails du tournoi */}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
