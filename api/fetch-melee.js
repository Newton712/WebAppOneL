// api/fetch-melee.js

export default async function handler(req, res) {
  const { meleeId } = req.query;
  if (!meleeId) return res.status(400).json({ error: 'Missing meleeId' });

  try {
    // Première requête pour récupérer l'URL de redirection
    const firstResponse = await fetch(`https://www.melee.gg/api/player/list/${meleeId}`, {
      method: 'GET',
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const redirectUrl = firstResponse.headers.get('location');
    if (!redirectUrl) {
      return res.status(502).json({ error: 'Redirect URL missing from melee.gg response' });
    }

    // Deuxième requête vers l'URL réelle des données
    const finalResponse = await fetch(redirectUrl);
    if (!finalResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch final redirected data' });
    }

    const data = await finalResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Proxy fetch failed', details: error.message });
  }
}
