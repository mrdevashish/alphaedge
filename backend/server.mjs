import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), port: PORT });
});

app.get('/', (req, res) => res.json({ ok: true, message: 'alphaedge backend root' }));

app.listen(PORT, ()=> console.log('Backend listening on', PORT));
