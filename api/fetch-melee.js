export default async function handler(req, res) {
  const meleeId = req.query.meleeId;
  if (!meleeId) {
    return res.status(400).json({ error: 'Missing meleeId' });
  }

  try {
    const response = await fetch(`https://www.melee.gg/api/player/list/${meleeId}`, {
      redirect: 'manual', // 🛑 empêche le suivi de redirection
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    });

    if (response.status === 302) {
      return res.status(502).json({ error: 'melee.gg responded with a redirect. Cannot proceed due to CORS.' });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from melee.gg' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
}
