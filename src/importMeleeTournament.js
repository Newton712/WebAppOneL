import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function importMeleeTournament(url) {
  try {
    // Récupération de la page HTML
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extraction du nom du tournoi
    const tournamentName = $('h1').first().text().trim() || 'Tournoi Melee Importé';

    // Insertion du tournoi dans Supabase
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .insert({ name: tournamentName })
      .select()
      .single();

    if (tournamentError) {
      console.error('Erreur lors de l\'insertion du tournoi :', tournamentError);
      return;
    }

    // Extraction des joueurs
    const players = [];
    $('table#playersTable tbody tr').each((_, row) => {
      const name = $(row).find('td').eq(0).text().trim();
      if (name) {
        players.push({ name, tournament_id: tournament.id });
      }
    });

    // Insertion des joueurs dans Supabase
    if (players.length > 0) {
      const { error: playersError } = await supabase.from('players').insert(players);
      if (playersError) {
        console.error('Erreur lors de l\'insertion des joueurs :', playersError);
        return;
      }
      console.log(`✅ ${players.length} joueurs importés`);
    }

    // Extraction des rounds et des matchs
    $('div.round-block').each(async (_, roundDiv) => {
      const roundName = $(roundDiv).find('h3').text().trim();
      const roundNumber = parseInt(roundName.replace(/\D/g, '')) || 0;

      // Insertion du round dans Supabase
      const { data: round, error: roundError } = await supabase
        .from('rounds')
        .insert({ tournament_id: tournament.id, number: roundNumber })
        .select()
        .single();

      if (roundError) {
        console.error('Erreur lors de l\'insertion du round :', roundError);
        return;
      }

      // Extraction des matchs
      const tables = [];
      $(roundDiv).find('table.match-table tbody tr').each((_, matchRow) => {
        const p1 = $(matchRow).find('td').eq(0).text().trim();
        const p2 = $(matchRow).find('td').eq(1).text().trim();

        const player1 = players.find(p => p.name === p1);
        const player2 = players.find(p => p.name === p2);

        if (player1 && player2) {
          tables.push({
            round_id: round.id,
            player1_id: player1.id,
            player2_id: player2.id
          });
        }
      });

      // Insertion des matchs dans Supabase
      if (tables.length > 0) {
        const { error: tablesError } = await supabase.from('tables').insert(tables);
        if (tablesError) {
          console.error('Erreur lors de l\'insertion des matchs :', tablesError);
          return;
        }
        console.log(`➡️ ${tables.length} matchs ajoutés pour ${roundName}`);
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'importation du tournoi :', error);
  }
}

// Exemple d'utilisation
importMeleeTournament('https://www.melee.gg/Tournament/View/305532');
