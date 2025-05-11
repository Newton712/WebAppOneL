// api/fetch-melee.js
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  const { meleeId } = req.query;
  if (!meleeId) return res.status(400).json({ error: 'Missing meleeId' });

  const url = `https://www.melee.gg/Tournament/View/${meleeId}`;

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
      const title = document.querySelector('h3.mb-1')?.innerText.trim() || null;
      const rows = document.querySelectorAll('#tournament-pairings-table tbody tr');
      const matches = [];
      const playersSet = new Set();

      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const player1 = cells[0].innerText.trim();
          const player2 = cells[1].innerText.trim();
          if (player1 && player2) {
            matches.push({ player1, player2 });
            playersSet.add(player1);
            playersSet.add(player2);
          }
        }
      });

      const players = Array.from(playersSet).map(name => ({ name }));
      return { title, players, matches };
    });

    await browser.close();

    if (!data.title) {
      return res.status(404).json({ error: 'Aucun tournoi trouvé.' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Erreur Puppeteer :', error);
    res.status(500).json({ error: 'Erreur lors du scraping avec Puppeteer.' });
  }
}
