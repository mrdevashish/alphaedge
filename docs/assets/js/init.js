import { loadSymbolInto } from './charts.js';
import './ticker.js'; // live ribbon
import { initRibbonFallback } from './ribbon.js'; // older section support

function boot(){
  // theme toggle
  const btn = document.createElement('button'); btn.textContent='🌓'; btn.className='theme-toggle';
  document.querySelector('.ae-navbar')?.appendChild(btn);
  btn.addEventListener('click', ()=>{
    const now = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = now; localStorage.setItem('theme', now);
    window.dispatchEvent(new Event('themechange'));
  });
  document.body.dataset.theme = localStorage.getItem('theme') || 'dark';

  // minis + clickable to full chart
  document.querySelectorAll('canvas.chart-mini').forEach(cv=>{
    const sym = cv.dataset.symbol?.trim(); if(!sym) return;
    loadSymbolInto(cv, sym).catch(console.error);
    cv.parentElement.style.cursor='pointer';
    cv.parentElement.addEventListener('click', ()=> location.href=`chart.html?s=${encodeURIComponent(sym)}`);
  });

  // fallback ticker if old container exists
  initRibbonFallback();

  // year in footer
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();

  // mobile menu
  const nv = document.querySelector('.nav-actions'); const tg = document.querySelector('.nav-toggle');
  tg?.addEventListener('click', ()=> nv?.classList.toggle('open'));
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
