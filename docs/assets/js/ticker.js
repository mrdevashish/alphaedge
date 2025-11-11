import { API_BASE } from './api.js';

const ribbon = document.getElementById('ticker-ribbon');
if (ribbon){
  const track = document.createElement('div');
  track.className = 'ticker__track';
  ribbon.appendChild(track);

  async function fetchTickers(){
    try{
      const res = await fetch(`${API_BASE}/tickers`);
      const json = await res.json();
      return json.data || [];
    }catch(e){
      console.error('ticker fetch failed', e);
      return [];
    }
  }

  function render(items){
    // Build two copies for seamless loop
    const chunk = items.map(it=>{
      const dir = it.change >= 0 ? 'up' : 'down';
      return `
        <span class="ticker__item">
          <span class="ticker__sym">${it.symbol}</span>
          <span class="ticker__px">${it.price.toFixed(2)}</span>
          <span class="ticker__chg ${dir}">
            ${it.change >= 0 ? '▲' : '▼'} ${Math.abs(it.changePct).toFixed(2)}%
          </span>
        </span>`;
    }).join('');
    track.innerHTML = chunk + chunk; // loop
  }

  async function loop(){
    const items = await fetchTickers();
    if (items.length) render(items);
  }

  loop();
  setInterval(loop, 2000);

  // respond to theme changes (optional: slow down in light theme)
  window.addEventListener('themechange', ()=>{
    // no-op for now; colors are CSS-driven
  });
}
