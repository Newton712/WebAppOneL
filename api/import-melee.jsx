import express from 'express';
import importMeleeTournament from './importMeleeTournament.js'; // ton script existant

const app = express();

app.get('/api/import-melee', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing melee.gg URL' });

  try {
    await importMeleeTournament(url);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Import failed' });
  }
});
