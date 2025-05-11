export default async function handler(req, res) {
  const { meleeId } = req.query;
  if (!meleeId) {
    return res.status(400).json({ error: 'Paramètre meleeId manquant' });
  }

  const targetUrl = `https://www.melee.gg/api/player/list/${meleeId}`;

  try {
    const proxyRes = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      }
    });

    const contentType = proxyRes.headers.get('content-type');

    if (!proxyRes.ok || !contentType?.includes('application/json')) {
      const errorText = await proxyRes.text();
      return res.status(proxyRes.status || 500).json({
        error: 'Réponse du serveur melee.gg invalide ou non JSON.',
        status: proxyRes.status,
        details: errorText.slice(0, 500) // Coupe pour éviter surcharge
      });
    }

    const data = await proxyRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: 'Erreur réseau ou proxy',
      details: err.message
    });
  }
}
