import { loadSymbolInto } from './charts.js';
import { initRibbon } from './ribbon.js';

// If you deploy, set this to your Render backend URL:
// window.API_BASE_OVERRIDE = "https://YOUR-BACKEND.onrender.com";

function boot(){
  // mini charts
  document.querySelectorAll('canvas.chart-mini').forEach(cv=>{
    const sym = cv.dataset.symbol?.trim();
    if(sym) loadSymbolInto(cv, sym).catch(err=>console.error('chart', sym, err));
  });

  // ticker ribbon
  initRibbon();

  // footer year
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();

  // simple mobile menu toggle
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-actions');
  btn?.addEventListener('click', ()=> nav?.classList.toggle('open'));
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
