import { fetchCandles } from './api.js';

const SYMBOLS = ['RELIANCE','TCS','INFY','NIFTY50','HDFCBANK','SBIN','ITC','LT','ICICIBANK'];

function pill({symbol, last, pct}){
  const up = pct >= 0;
  const cls = up ? 'up' : 'down';
  const sign = up ? '+' : '';
  return `
    <div class="tick ${cls}">
      <span class="sym">${symbol}</span>
      <span class="px">${last.toFixed(2)}</span>
      <span class="pct">${sign}${pct.toFixed(2)}%</span>
    </div>`;
}

async function fetchOne(sym){
  try{
    const c = await fetchCandles(sym);
    if(c.length < 2) return { symbol:sym, last:NaN, pct:0 };
    const last = c[c.length-1].c;
    const prev = c[c.length-2].c;
    const pct  = ((last - prev) / prev) * 100;
    return { symbol:sym, last, pct };
  }catch(e){
    return { symbol:sym, last:NaN, pct:0 };
  }
}

function renderInto(root, rows){
  // duplicate the row so CSS marquee can loop seamlessly
  const html = rows.map(pill).join('');
  root.innerHTML = `
    <div class="scroll">${html}${html}</div>
  `;
}

export async function initRibbon(){
  const root = document.getElementById('ticker');
  if(!root) return;

  // initial load
  const rows = await Promise.all(SYMBOLS.map(fetchOne));
  renderInto(root, rows);

  // refresh every 20s
  setInterval(async ()=>{
    const rows = await Promise.all(SYMBOLS.map(fetchOne));
    renderInto(root, rows);
  }, 20000);
}
