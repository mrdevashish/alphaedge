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

// --- LIVE TICKERS (demo data that drifts slightly) ---
const TICKER_LIST = [
  "RELIANCE","TCS","HDFCBANK","INFY","ITC",
  "SBIN","BHARTIARTL","HINDUNILVR","BAJFINANCE","ICICIBANK"
];

const tickersState = new Map(
  TICKER_LIST.map(s => [s, { price: 100 + Math.random()*100, change: 0 }])
);

function n2(x){ return Math.round(x*100)/100; }

function nextTickers(){
  TICKER_LIST.forEach(sym=>{
    const st = tickersState.get(sym);
    // small random walk
    const delta = (Math.random()-0.5) * 0.6;    // ~ +/-0.3
    const newPrice = Math.max(1, st.price + delta);
    st.change = newPrice - st.price;
    st.price = newPrice;
  });
  return TICKER_LIST.map(sym=>{
    const st = tickersState.get(sym);
    const changePct = st.change / (st.price - st.change) * 100;
    return {
      symbol: sym,
      price: n2(st.price),
      change: n2(st.change),
      changePct: n2(changePct)
    };
  });
}

app.get("/api/tickers", (req, res)=>{
  res.json({ asOf: Date.now(), data: nextTickers() });
});
