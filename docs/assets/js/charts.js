import { fetchCandles } from './api.js';

/** Simple sparkline/mini-candles on canvas */
export async function loadSymbolInto(canvas, symbol){
  const ctx = canvas.getContext('2d');
  const w = canvas.width  = canvas.clientWidth;
  const h = canvas.height = canvas.height || 140;

  // background clear
  ctx.fillStyle = '#111623';
  ctx.fillRect(0,0,w,h);

  // get data
  const candles = await fetchCandles(symbol);
  if(!candles.length){
    drawText(ctx, w, h, 'No Data'); 
    return;
  }

  // compute scale
  const highs = candles.map(c=>c.h);
  const lows  = candles.map(c=>c.l);
  const vmax = Math.max(...highs), vmin = Math.min(...lows);
  const pad = (vmax - vmin) * 0.08 || 1;
  const max = vmax + pad, min = vmin - pad;

  // line path of closes
  const closes = candles.map(c=>c.c);
  const X = (i)=> (i/(closes.length-1)) * (w-16) + 8;
  const Y = (v)=> h - ((v - min) / (max - min)) * (h-24) - 8;

  // gradient stroke
  const g = ctx.createLinearGradient(0,0,w,0);
  g.addColorStop(0,'#5ac8fa'); g.addColorStop(1,'#7bd88f');
  ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.beginPath();
  closes.forEach((v,i)=>{ const x=X(i), y=Y(v); i?ctx.lineTo(x,y):ctx.moveTo(x,y); });
  ctx.stroke();

  // last price label
  const last = closes.at(-1);
  ctx.fillStyle = '#e6e9ef'; ctx.font = '12px ui-sans-serif';
  ctx.fillText(String(last), 10, 14);
}

function drawText(ctx,w,h,msg){
  ctx.fillStyle = '#9aa4b2';
  ctx.font = '12px ui-sans-serif';
  ctx.fillText(msg, 10, 16);
}
import { applyThemeToChart } from './theme.js';

window.addEventListener("themechange", ()=>{
  const theme = document.body.classList.contains("light") ? "light":"dark";
  document.querySelectorAll("canvas").forEach(cv=>{
    const ctx = cv.getContext("2d");
    const colors = applyThemeToChart(ctx, theme);
    // placeholder: refresh background instantly
    cv.style.background = colors.backgroundColor;
  });
});
