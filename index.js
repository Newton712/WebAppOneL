// index.js (Render-compatible proxy server)
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Root route to avoid CSP favicon error
app.get('/', (req, res) => {
  res.send('Melee proxy is running. Use /fetch-melee?meleeId=12345');
});

// Optional: handle favicon requests cleanly
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Main proxy route
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

    const headersList = [...firstResponse.headers.entries()];
    console.log('First response headers:', headersList);

    const redirectUrl = firstResponse.headers.get('location');

   if (!redirectUrl) {
  return res.status(502).json({ 
    error: 'Redirect URL missing from melee.gg response',
    headers: headersList,
    status: firstResponse.status
  });
}


    const finalResponse = await fetch(redirectUrl);
    if (!finalResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch final redirected data' });
    }

    const data = await finalResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Proxy fetch failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
