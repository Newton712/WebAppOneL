// api/fetch-melee.js
export default async function handler(req, res) {
  const { meleeId } = req.query;

  if (!meleeId) {
    return res.status(400).json({ error: "Missing meleeId" });
  }

  try {
    const response = await fetch(`https://www.melee.gg/api/player/list/${meleeId}`);
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch from melee.gg" });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Unexpected error", details: err.message });
  }
}
