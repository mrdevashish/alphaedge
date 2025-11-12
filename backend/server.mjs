import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// helper: get Yahoo chart closes
async function getClosesYF(symbol, range='1mo', interval='1d') {
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(`YF ${r.status}`);
  const j = await r.json();
  const close = j.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
  return close.filter(x => typeof x === 'number');
}

// POST /api/ai/analyze { symbol, tf }
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const symbol = (req.body?.symbol || '').trim();
    const tf = (req.body?.tf || '1d');
    if (!symbol) return res.status(400).json({ ok:false, error:'symbol required' });

    const range = tf === '1h' ? '5d' : '1mo';
    const interval = tf === '1h' ? '1h' : '1d';
    const closes = await getClosesYF(symbol, range, interval);

    const last = closes.at(-1), prev = closes.at(-2);
    const momentum = (last && prev) ? (((last - prev) / prev) * 100) : null;

    return res.json({
      ok: true,
      symbol,
      tf,
      momentum: momentum === null ? '-' : momentum.toFixed(2)
    });
  } catch (err) {
    console.error('Analyze Error', err);
    res.status(500).json({ ok:false, error:String(err) });
  }
});

// POST /api/screener { symbols:"AAPL,MSFT", tf:"1d" }
app.post('/api/screener', async (req, res) => {
  try {
    const symbols = String(req.body?.symbols || '').split(/[,\s]+/).filter(Boolean);
    const tf = (req.body?.tf || '1d');
    const range = tf === '1h' ? '5d' : '1mo';
    const interval = tf === '1h' ? '1h' : '1d';

    const results = [];
    for (const s of symbols) {
      try {
        const closes = await getClosesYF(s, range, interval);
        const last = closes.at(-1), prev = closes.at(-2);
        const m = (last && prev) ? (((last - prev) / prev) * 100) : null;

        // SMA20 comparison if enough data
        const n = 20;
        let vsSMA20 = '-';
        if (closes.length >= n) {
          const recent = closes.slice(-n);
          const sma = recent.reduce((a,b)=>a+b,0)/n;
          vsSMA20 = (last && sma) ? (((last - sma)/sma)*100).toFixed(2) : '-';
        }

        results.push({ symbol: s, momentum: m===null?'-':m.toFixed(2), vsSMA20 });
      } catch (e) {
        results.push({ symbol: s, error: String(e.message || e) });
      }
    }
    res.json({ ok:true, results });
  } catch (err) {
    console.error('Screener Error', err);
    res.status(500).json({ ok:false, error:String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`✅ AlphaEdge backend running on http://127.0.0.1:${PORT}`);
});
