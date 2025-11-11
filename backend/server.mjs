import express from "express";
import cors from "cors";

import {
  openDB, listSubs, toggleSub, upsertSub,
  listEvents, recordEvent
} from "./db.mjs";

const app = express();
const PORT = Number(process.env.PORT || 5000);

// Middlewares
app.use(cors());
app.use(express.json());

// Ensure DB is open
await openDB();

// Health
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Demo OHLC candles (same as before)
function makeCandles(n = 60) {
  const out = [];
  let last = 100 + Math.random() * 5;
  for (let i = 0; i < n; i++) {
    const open = last;
    const delta = (Math.random() - 0.5) * 2.2;
    const close = Math.max(0.1, open + delta);
    const high = Math.max(open, close) + Math.random() * 0.8;
    const low  = Math.min(open, close) - Math.random() * 0.8;
    const volume = Math.floor(5000 + Math.random() * 9000);
    out.push({ i, o: Number(open.toFixed(2)), h: Number(high.toFixed(2)),
               l: Number(low.toFixed(2)), c: Number(close.toFixed(2)), v: volume });
    last = close;
  }
  return out;
}
app.get("/api/candles/:symbol", (req, res) => {
  recordEvent("chart.query", { symbol: req.params.symbol, ts: Date.now() });
  res.json({ symbol: req.params.symbol.toUpperCase(), candles: makeCandles(60) });
});

// --- SUBSCRIPTIONS API ------------------------------------------------------

// List all subs (no auth here for simplicity)
app.get("/api/subs", (_req, res) => res.json(listSubs()));

// Toggle a subscription by email (admin/simple)
app.post("/api/admin/subs/toggle", (req, res) => {
  const email = String(req.body?.email || "").trim();
  if (!email) return res.status(400).json({ ok: false, error: "email required" });
  const r = toggleSub(email);
  return res.json({ ok: true, ...r });
});

// Optional: upsert subscribe endpoint from public UI
app.post("/api/subscribe", (req, res) => {
  const email = String(req.body?.email || "").trim();
  if (!email) return res.status(400).json({ ok: false, error: "email required" });
  const r = upsertSub(email, true);
  return res.json({ ok: true, ...r });
});

// Events (debug)
app.get("/api/events", (_req, res) => res.json(listEvents(200)));

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
