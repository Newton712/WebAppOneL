import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/fetch-melee', async (req, res) => {
  const { meleeId } = req.query;
  if (!meleeId) return res.status(400).json({ error: 'Missing meleeId' });

  try {
    const firstResponse = await fetch(`https://www.melee.gg/api/player/list/${meleeId}`, {
      method: 'GET',
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const redirectUrl = firstResponse.headers.get('location');
    if (!redirectUrl) return res.status(502).json({ error: 'No redirect from melee.gg' });

    const finalResponse = await fetch(redirectUrl);
    if (!finalResponse.ok) return res.status(500).json({ error: 'Redirect fetch failed' });

    const data = await finalResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
