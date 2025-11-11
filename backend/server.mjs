import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// health
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// fake candles
function makeCandles(n = 60) {
  const out = [];
  let last = 100;
  for (let i = 0; i < n; i++) {
    const open = last;
    const delta = (Math.random() - 0.5) * 2;
    const close = Math.max(1, open + delta);
    const high = Math.max(open, close) + Math.random();
    const low  = Math.min(open, close) - Math.random();
    const volume = Math.floor(5000 + Math.random() * 10000);
    out.push({ i, o: open, h: high, l: low, c: close, v: volume });
    last = close;
  }
  return out;
}

app.get("/api/candles/:symbol", (req, res) => {
  const candles = makeCandles(60);
  res.json({ symbol: req.params.symbol.toUpperCase(), candles });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
});
