import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ---- Mock OHLC data ----
function makeCandles(n = 200) {
  const out = [];
  let last = 100 + Math.random() * 30;
  for (let i = 0; i < n; i++) {
    const open = last;
    const delta = (Math.random() - 0.5) * 2.2;
    const close = Math.max(1, open + delta);
    const high = Math.max(open, close) + Math.random() * 0.9;
    const low  = Math.min(open, close) - Math.random() * 0.9;
    const volume = Math.floor(30_000 + Math.random() * 40_000);
    out.push({
      i, o:+open.toFixed(2), h:+high.toFixed(2), l:+low.toFixed(2), c:+close.toFixed(2), v: volume
    });
    last = close;
  }
  return out;
}

app.get("/health", (_req,res)=>res.json({ status:"ok" }));
app.get("/api/candles/:symbol", (req,res)=>{
  const symbol = (req.params.symbol||"DEMO").toUpperCase();
  res.json({ symbol, candles: makeCandles(240) });
});

// ---- Live tickers (demo drift) ----
const TICKER_LIST = ["RELIANCE","TCS","HDFCBANK","INFY","ITC","SBIN","BHARTIARTL","HINDUNILVR","BAJFINANCE","ICICIBANK"];
const tickersState = new Map(TICKER_LIST.map(s => [s, { price: 100 + Math.random()*100, change: 0 }]));
const n2 = x => Math.round(x*100)/100;

function nextTickers(){
  TICKER_LIST.forEach(sym=>{
    const st = tickersState.get(sym);
    const delta = (Math.random()-0.5) * 0.6;  // ~ +/-0.3
    const newPrice = Math.max(1, st.price + delta);
    st.change = newPrice - st.price;
    st.price = newPrice;
  });
  return TICKER_LIST.map(sym=>{
    const st = tickersState.get(sym);
    const prev = st.price - st.change || 1;
    const changePct = (st.change / prev) * 100;
    return { symbol:sym, price:n2(st.price), change:n2(st.change), changePct:n2(changePct) };
  });
}
app.get("/api/tickers", (_req,res)=> res.json({ asOf: Date.now(), data: nextTickers() }) );

app.listen(PORT,"0.0.0.0",()=>console.log(`Listening on http://0.0.0.0:${PORT}`));
