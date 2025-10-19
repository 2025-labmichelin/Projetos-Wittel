// Simple Node/Express proxy to fetch Trello board JSON using server-side secrets.
// Usage: GET /api/board?boardId=<BOARD_ID>
// Deploy as small Express app or serverless function (adapte handler se necessário).

const express = require('express');
const fetch = require('node-fetch'); // se usar Node >=18, pode usar global fetch
const app = express();

const PORT = process.env.PORT || 3000;
const TRELLO_KEY = process.env.TRELLO_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

if (!TRELLO_KEY || !TRELLO_TOKEN) {
  console.error('Missing TRELLO_KEY or TRELLO_TOKEN in env vars.');
  process.exit(1);
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/board', async (req, res) => {
  try {
    const boardId = req.query.boardId;
    if (!boardId) return res.status(400).json({ error: 'Missing boardId param' });

    const url = `https://api.trello.com/1/boards/${encodeURIComponent(boardId)}?cards=all&lists=all&members=all&member_fields=fullName,username&card_fields=name,desc,idList,labels,shortUrl&key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

    const trelloRes = await fetch(url);
    if (!trelloRes.ok) {
      const text = await trelloRes.text();
      return res.status(trelloRes.status).send(text);
    }
    const data = await trelloRes.json();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Trello proxy running on port ${PORT}`);
});
