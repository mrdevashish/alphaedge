import { API_BASE, fetchCandles } from './api.js';

function cssColor(el, name, fallback){ const v = getComputedStyle(el).getPropertyValue(name).trim(); return v || fallback; }

export async function loadSymbolInto(target, symbol){
  const canvas = (typeof target === 'string') ? document.getElementById(target) : target;
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  const candles = await fetchCandles(symbol);
  const W = canvas.clientWidth || 320, H = canvas.height || 140;
  canvas.width = W; canvas.height = H;
  ctx.clearRect(0,0,W,H);

  if(!candles.length){ ctx.fillStyle = '#9aa4b2'; ctx.fillText('No data', 10, 16); return; }

  // scale
  const hi = Math.max(...candles.map(c=>c.h));
  const lo = Math.min(...candles.map(c=>c.l));
  const xStep = W / candles.length;
  const Y = v => H - ((v-lo)/(hi-lo || 1))*H;

  const upColor = cssColor(canvas,'--candle-up','#17c964');
  const dnColor = cssColor(canvas,'--candle-dn','#ff4d4f');

  ctx.lineWidth = Math.max(1, Math.floor(xStep*0.15));
  candles.forEach((c,i)=>{
    const x = Math.floor(i*xStep + xStep/2);
    const up = c.c >= c.o;
    ctx.strokeStyle = up ? upColor : dnColor;
    // wick
    ctx.beginPath(); ctx.moveTo(x, Math.floor(Y(c.h))); ctx.lineTo(x, Math.floor(Y(c.l))); ctx.stroke();
    // body
    ctx.beginPath(); ctx.moveTo(x, Math.floor(Y(c.o))); ctx.lineTo(x, Math.floor(Y(c.c))); ctx.stroke();
  });

  // last price label
  const last = candles.at(-1)?.c;
  if(last != null){ ctx.fillStyle = '#cfe1ff'; ctx.font = '12px ui-sans-serif'; ctx.fillText(`${symbol}: ${last.toFixed(2)}`, 8, 14); }
}

// rerender minis on theme change
window.addEventListener('themechange', ()=>{
  document.querySelectorAll('canvas.chart-mini').forEach(cv=>{
    const s = cv.dataset.symbol; if(s) loadSymbolInto(cv, s);
  });
});
