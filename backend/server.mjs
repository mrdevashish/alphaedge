import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/health", (req, res) => res.json({ status: "ok" }));

// simple synthetic candles so frontend always has data
app.get("/api/candles/:symbol", (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const candles = Array.from({ length: 120 }, (_, i) => {
    const base = 100 + Math.sin(i / 10) * 5;
    const o = base + (Math.random() - 0.5) * 1.2;
    const c = o + (Math.random() - 0.5) * 1.8;
    const h = Math.max(o, c) + Math.random();
    const l = Math.min(o, c) - Math.random();
    const v = 1000 + Math.floor(Math.random() * 4000);
    return { i, o, h, l, c, v };
  });
  res.json({ symbol, candles });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ AlphaEdge backend running on ${PORT}`);
});
