import { fetchCandles } from './api.js';
const SYMBOLS = ['RELIANCE','TCS','INFY','NIFTY50','HDFCBANK','SBIN','ITC','LT','ICICIBANK'];
function pill({symbol,last,pct}){
  const up = pct >= 0, sign = up?'+':'';
  return `<span class="ticker__item"><span class="ticker__sym">${symbol}</span><span class="ticker__px">${last.toFixed(2)}</span><span class="ticker__chg ${up?'up':'down'}">${sign}${pct.toFixed(2)}%</span></span>`;
}
async function fetchOne(sym){
  try{
    const c = await fetchCandles(sym);
    if(c.length<2) return {symbol:sym,last:NaN,pct:0};
    const last = c.at(-1).c, prev = c.at(-2).c; return {symbol:sym,last,pct:(last-prev)/prev*100};
  }catch{ return {symbol:sym,last:NaN,pct:0}; }
}
export async function initRibbonFallback(){
  const root = document.getElementById('ticker');
  if(!root) return;
  const rows = await Promise.all(SYMBOLS.map(fetchOne));
  const track = document.createElement('div'); track.className='ticker__track';
  track.innerHTML = rows.map(pill).join('') + rows.map(pill).join('');
  root.innerHTML=''; root.appendChild(track);
}
