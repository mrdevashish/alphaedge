import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

/** Fake candles for now (front-end can call /api/candles/:symbol) */
function makeCandles(n = 60) {
  const out = [];
  let close = 100;
  for (let i = 0; i < n; i++) {
    const o = close;
    const d = (Math.random() - 0.5) * 2;
    const c = Math.max(1, o + d);
    const h = Math.max(o, c) + Math.random();
    const l = Math.min(o, c) - Math.random();
    const v = Math.floor(Math.random() * 1000) + 100;
    out.push({ i, o, h, l, c, v });
    close = c;
  }
  return out;
}

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/api/candles/:symbol", (req, res) => {
  res.json({ symbol: req.params.symbol.toUpperCase(), candles: makeCandles(60) });
});

/** Render/Termux: listen on 0.0.0.0 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
