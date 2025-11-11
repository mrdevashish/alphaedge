import { API_BASE } from './api.js';
const ribbon = document.getElementById('ticker-ribbon');
if (ribbon){
  const track = document.createElement('div'); track.className='ticker__track'; ribbon.appendChild(track);
  async function fetchTickers(){
    try{
      const r = await fetch(`${API_BASE}/api/tickers`, { cache:'no-store' });
      const j = await r.json(); return j.data||[];
    }catch{ return []; }
  }
  function render(items){
    const view = items.map(it=>{
      const dir = it.change >= 0 ? 'up' : 'down';
      const pct = Math.abs(it.changePct).toFixed(2);
      return `<span class="ticker__item"><span class="ticker__sym">${it.symbol}</span><span class="ticker__px">${it.price.toFixed(2)}</span><span class="ticker__chg ${dir}">${it.change>=0?'▲':'▼'} ${pct}%</span></span>`;
    }).join('');
    track.innerHTML = view + view; // seamless
  }
  async function loop(){ render(await fetchTickers()); }
  loop(); setInterval(loop, 2000);
}
