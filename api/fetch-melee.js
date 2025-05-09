export default async function handler(req, res) {
  const { meleeId } = req.query;
  if (!meleeId) return res.status(400).json({ error: 'Missing meleeId' });

  try {
    const url = `https://www.melee.gg/api/player/list/${meleeId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'manual'
    });

    const text = await response.text();
    res.status(200).json({
      status: response.status,
      headers: [...response.headers.entries()],
      body: text.slice(0, 500) // on coupe pour éviter les surcharges
    });
  } catch (error) {
    res.status(500).json({ error: 'Proxy fetch failed', details: error.message });
  }
}
