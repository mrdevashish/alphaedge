import { fetchCandles } from "./api.js";

async function updateChart() {
  const data = await fetchCandles("RELIANCE");
  if (data.length === 0) {
    document.getElementById("mini-reliance").innerHTML =
      "<p style='color:white;text-align:center;'>No data</p>";
    return;
  }

  // Example: show latest price
  const latest = data[data.length - 1];
  document.querySelector(".price").textContent = latest.close.toFixed(2);
}

updateChart();
setInterval(updateChart, 10000);
const byId = (id)=>document.getElementById(id);

async function drawMini(symbol, canvasId){
  const ctx = byId(canvasId).getContext("2d");
  const { candles } = await api(`/api/candles/${symbol}`);
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.clearRect(0,0,w,h);
  const closes = candles.map(c=>c.c);
  const min = Math.min(...closes), max = Math.max(...closes);
  const xStep = w/(closes.length-1 || 1);

  // axis
  ctx.lineWidth = 1; ctx.globalAlpha = .5;
  ctx.beginPath(); ctx.moveTo(0,h-0.5); ctx.lineTo(w,h-0.5); ctx.stroke();
  ctx.globalAlpha = 1;

  // line
  ctx.beginPath();
  closes.forEach((v,i)=>{
    const x = i*xStep;
    const y = h - ((v-min)/(max-min || 1))*h;
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  });
  ctx.stroke();

  // last price label
  const last = closes.at(-1).toFixed(2);
  byId(`${canvasId}-price`).textContent = last;
}

async function boot(){
  // add a debug banner so you can see which backend is used
  const dbg = document.createElement("div");
  dbg.textContent = `backend: ${window.API_BASE_OVERRIDE||'local'}`;
  Object.assign(dbg.style,{position:"fixed",left:"8px",bottom:"8px",padding:"4px 8px",fontSize:"12px",background:"#000",color:"#fff",borderRadius:"8px",zIndex:9999,opacity:.7});
  document.body.appendChild(dbg);

  await drawMini("RELIANCE","mini-reliance");
  // poll every 10s
  setInterval(()=>drawMini("RELIANCE","mini-reliance"), 10_000);
}
document.addEventListener("DOMContentLoaded", boot);
