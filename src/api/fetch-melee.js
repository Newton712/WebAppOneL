// api/fetch-melee.js
export default async function handler(req, res) {
  const { meleeId } = req.query;
  if (!meleeId) return res.status(400).json({ error: 'Missing meleeId' });

  try {
    const url = `https://www.melee.gg/api/player/list/${meleeId}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.ok) {
      throw new Error(`Erreur API melee: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erreur proxy', details: err.message });
  }
}
