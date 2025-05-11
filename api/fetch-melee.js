// api/fetch-melee.js
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  const { meleeId } = req.query;
  if (!meleeId) return res.status(400).json({ error: 'Missing meleeId' });

  const meleeUrl = `https://www.melee.gg/Tournament/View/${meleeId}`;

  try {
    const htmlRes = await fetch(meleeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!htmlRes.ok) {
      return res.status(htmlRes.status).json({ error: 'Erreur fetch HTML', status: htmlRes.status });
    }

    const html = await htmlRes.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Exemple : extraire tous les joueurs (à adapter à la structure réelle)
    const playerElements = document.querySelectorAll('.player-list .player-name');
    const players = Array.from(playerElements).map(el => ({ name: el.textContent.trim() }));

    if (!players.length) {
      console.warn('Aucun joueur trouvé');
      return res.status(500).json({ error: 'Aucun joueur trouvé' });
    }

    res.status(200).json(players);
  } catch (err) {
    console.error('Scraping error:', err);
    res.status(500).json({ error: 'Erreur lors du scraping', details: err.message });
  }
}
