/* Mini demo chart (no external libs) */
const ctx = document.getElementById('miniChart');
if (ctx && ctx.getContext) {
  const g = ctx.getContext('2d');
  const W = ctx.width, H = ctx.height;
  // fake data
  const points = Array.from({length: 60}, (_, i) => {
    const base = 19600 + i*4;
    const noise = Math.sin(i/4)*40 + (Math.random()*50-25);
    return base + noise;
  });
  const min = Math.min(...points), max = Math.max(...points);
  const pad = 18;
  g.clearRect(0,0,W,H);
  // axes
  g.strokeStyle = '#e6e9f2'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(pad,H-pad); g.lineTo(W-pad,H-pad); g.stroke();
  // line
  g.strokeStyle = '#4f46e5'; g.lineWidth = 2;
  g.beginPath();
  points.forEach((v,i)=>{
    const x = pad + (i/(points.length-1))*(W-2*pad);
    const y = H-pad - ((v-min)/(max-min))*(H-2*pad);
    i? g.lineTo(x,y) : g.moveTo(x,y);
  });
  g.stroke();
  // fill
  const grad = g.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,'rgba(79,70,229,.25)');
  grad.addColorStop(1,'rgba(79,70,229,0)');
  g.fillStyle = grad;
  g.lineTo(W-pad,H-pad); g.lineTo(pad,H-pad); g.closePath(); g.fill();
  // stats
  const last = points.at(-1), first = points[0];
  const chg = last-first;
  document.getElementById('niftyVal').textContent = last.toFixed(0);
  const el = document.getElementById('niftyChg');
  el.textContent = (chg>=0?'+':'') + chg.toFixed(0);
  el.parentElement.classList.toggle('up', chg>=0);
  el.parentElement.classList.toggle('down', chg<0);
  document.getElementById('niftyVol').textContent = (Math.random()*1.2+0.8).toFixed(2)+'M';
}

document.getElementById('yr') && (document.getElementById('yr').textContent = new Date().getFullYear());

// API base (already set in HTML). Example ping:
(async ()=>{
  try{
    const res = await fetch(`${window.API_BASE}/health`).catch(()=>null);
    // ignore output; just verifies CORS later
  }catch(e){}
})();
