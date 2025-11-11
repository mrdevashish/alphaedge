import { fetchCandles } from "./api.js";

export async function loadSymbolInto(canvasId, symbol) {
  const el = document.getElementById(canvasId);
  if (!el) return;
  const { candles } = await fetchCandles(symbol);
  const ctx = el.getContext("2d");
  ctx.clearRect(0,0,el.width,el.height);

  // scale
  const w = el.width, h = el.height;
  const vals = candles.map(c=>c.c);
  const min = Math.min(...vals), max = Math.max(...vals);
  const X = i => (i/(candles.length-1))*w;
  const Y = v => h - ((v-min)/(max-min||1))*h;

  // line
  ctx.beginPath();
  candles.forEach((c,i)=>{ const x=X(i), y=Y(c.c); i?ctx.lineTo(x,y):ctx.moveTo(x,y); });
  ctx.lineWidth = 2;
  ctx.stroke();

  // last price
  const last = candles.at(-1).c.toFixed(2);
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText(`${symbol}: ${last}`, 6, 14);
}

window.loadSymbolInto = loadSymbolInto; // allow inline call from HTML
