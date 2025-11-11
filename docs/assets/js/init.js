// If you deploy, set this to your Render backend URL:
// window.API_BASE_OVERRIDE = "https://YOUR-BACKEND.onrender.com";

import { loadSymbolInto } from './charts.js';

// bootstrap all canvases with class 'chart-mini'
function boot(){
  document.querySelectorAll('canvas.chart-mini').forEach(cv=>{
    const sym = cv.dataset.symbol?.trim();
    if(sym) loadSymbolInto(cv, sym).catch(err=>console.error('chart', sym, err));
  });

  // mobile year
  document.getElementById('year').textContent = new Date().getFullYear();

  // simple mobile menu toggle (optional)
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-actions');
  btn?.addEventListener('click', ()=> nav?.classList.toggle('open'));
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
