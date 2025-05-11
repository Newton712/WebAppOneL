// /api/fetch-melee.js
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  const { meleeId } = req.query;
  if (!meleeId) return res.status(400).json({ error: 'Missing meleeId' });

  try {
    const response = await fetch(`https://www.melee.gg/Tournament/View/${meleeId}`);
    if (!response.ok) throw new Error("Failed to fetch melee.gg");

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // 🧍 Scrape les noms de joueurs
    const playerElements = doc.querySelectorAll(".player-name"); // Ajuste selon la classe réelle
    const players = Array.from(playerElements).map(el => ({ name: el.textContent.trim() }));

    // Tu peux aussi extraire le nom du tournoi, rounds, matchs ici si dispo
    const title = doc.querySelector("h1")?.textContent?.trim() || `Import ${meleeId}`;

    return res.status(200).json({ players, title });
  } catch (error) {
    return res.status(500).json({ error: 'Scraping failed', details: error.message });
  }
}
