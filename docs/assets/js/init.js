import { api, apiJSON } from "./api.js";

function el(q){ return document.querySelector(q); }

async function loadMiniChart(canvasId, symbol) {
  try {
    const j = await apiJSON(`/api/candles/${encodeURIComponent(symbol)}`);
    const ctx = el(`#${canvasId}`).getContext('2d');
    const labels = j.candles.map(c => c.i);
    const close  = j.candles.map(c => c.c);

    // Draw simple sparkline
    const w = ctx.canvas.width, h = ctx.canvas.height;
    ctx.clearRect(0,0,w,h);
    const min = Math.min(...close), max = Math.max(...close);
    const x = i => (i/(close.length-1))*(w-6)+3;
    const y = v => h - ((v-min)/(max-min||1))*(h-6) - 3;
    ctx.beginPath();
    close.forEach((v,i)=> (i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v))));
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Last price dot
    ctx.beginPath();
    ctx.arc(x(close.length-1), y(close.at(-1)), 2, 0, Math.PI*2);
    ctx.fill();
  } catch(e) {
    console.error("chart error", e);
    const c = el(`#${canvasId}`).getContext('2d');
    c.font = "12px sans-serif";
    c.fillText("Chart unavailable", 6, 16);
  }
}

async function subscribeEmail() {
  const box = el("#sub_email");
  const email = (box?.value||"").trim();
  if (!email) return alert("Please enter your email");
  const r = await api("/api/subscribe", {
    method:"POST",
    body: JSON.stringify({ email })
  });
  alert(r.ok ? "Subscribed!" : "Failed");
}

function wireUI(){
  const btn = el("#sub_btn");
  if (btn) btn.onclick = subscribeEmail;

  // Load a couple of mini charts
  loadMiniChart("mini-reliance", "RELIANCE");
  loadMiniChart("mini-tcs", "TCS");
}

// Allow override host via <script> on page (for Render)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", wireUI);
} else {
  wireUI();
}
