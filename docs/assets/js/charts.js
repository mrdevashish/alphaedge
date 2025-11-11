// charts.js — super-light sparkline + poller
import { apiJSON, debug } from "./api.js";

function drawSpark(ctx, values) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.clearRect(0,0,w,h);
  if (!values?.length) return;
  const min = Math.min(...values), max = Math.max(...values);
  const pad = 4;
  const nx = i => pad + (i*(w-2*pad))/(values.length-1||1);
  const ny = v => h - pad - ((v-min) * (h-2*pad)) / ((max-min)||1);

  // path
  ctx.beginPath();
  values.forEach((v,i)=>{
    const x = nx(i), y = ny(v);
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#4da3ff";
  ctx.stroke();

  // last point dot
  const lastY = ny(values.at(-1));
  ctx.fillStyle = "#4da3ff";
  ctx.beginPath(); ctx.arc(w-6, lastY, 3, 0, Math.PI*2); ctx.fill();
}

export async function loadSymbolInto(canvasId, symbol) {
  const el = document.getElementById(canvasId);
  if (!el) { debug(`Canvas ${canvasId} not found`); return; }

  // make sure we have a 2D context and proper pixel size for DPR
  const ctx = el.getContext("2d");
  const DPR = window.devicePixelRatio || 1;
  const cssW = el.clientWidth || 300;
  const cssH = el.clientHeight || 120;
  el.width = Math.floor(cssW*DPR);
  el.height = Math.floor(cssH*DPR);
  ctx.scale(DPR, DPR);

  async function tick() {
    try {
      const j = await apiJSON(`/api/candles/${encodeURIComponent(symbol)}`);
      const closes = (j.candles||[]).map(c => Number(c.c));
      if (!closes.length) throw new Error("No candles");
      drawSpark(ctx, closes.slice(-100));     // last N points
      debug(`OK ${symbol} • ${closes.length} points`);
    } catch (e) {
      debug(`ERR ${symbol}: ${e.message}`);
    }
  }

  await tick();                     // first paint
  return setInterval(tick, 10_000); // refresh every 10s
}
