import { loadSymbolInto } from './charts.js';
import { initRibbon } from './ribbon.js';

function boot(){
  document.querySelectorAll('canvas.chart-mini').forEach(cv=>{
    const sym = cv.dataset.symbol?.trim();
    if(sym){
      loadSymbolInto(cv, sym).catch(console.error);
      cv.parentElement.style.cursor = 'pointer';
      cv.parentElement.addEventListener('click', ()=> location.href=`symbol.html?s=${sym}`);
    }
  });

  initRibbon();

  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();

  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-actions');
  btn?.addEventListener('click', ()=> nav?.classList.toggle('open'));
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
