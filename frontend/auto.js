(() => {
  let API_BASE = (window.API_BASE) || 'http://127.0.0.1:5000';
  const j = (p,o={}) => fetch(`$http://127.0.0.1:5000${p}`, o);
  const jJSON = (p,o={}) => j(p,o).then(r => { if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });

  const $ = s => document.querySelector(s);

  // Analyzer
  const analyzeBtn = $('#analyzeBtn'), aiSymbol = $('#aiSymbol'), aiTf = $('#aiTf'), aiOut = $('#aiOut');
  if (analyzeBtn && aiSymbol && aiTf && aiOut) {
    analyzeBtn.onclick = async () => {
      aiOut.textContent = 'Loading...';
      try {
        const body = JSON.stringify({ symbol: aiSymbol.value.trim(), tf: aiTf.value });
        const data = await jJSON('/api/ai/analyze', { method:'POST', headers:{'Content-Type':'application/json'}, body });
        aiOut.textContent = JSON.stringify(data, null, 2);
      } catch (e) { aiOut.textContent = `Analyzer Error: ${e.message}`; }
    };
  }

  // Screener
  const runScr = $('#runScr'), scrList = $('#scrList'), scrTf = $('#scrTf'), scrBody = $('#scrBody');
  if (runScr && scrList && scrTf && scrBody) {
    runScr.onclick = async () => {
      scrBody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
      try {
        const body = JSON.stringify({ symbols: scrList.value.trim(), tf: scrTf.value });
        const data = await jJSON('/api/screener', { method:'POST', headers:{'Content-Type':'application/json'}, body });
        if (!data.ok) throw new Error(data.error || 'Unknown');
        scrBody.innerHTML = (data.results||[]).map(r=>`
          <tr><td>${r.symbol||'-'}</td><td>${r.momentum??'-'}</td><td>${r.vsSMA20??'-'}</td></tr>
        `).join('') || '<tr><td colspan="3">No data</td></tr>';
      } catch (e) { scrBody.innerHTML = `<tr><td colspan="3">Screener Error: ${e.message}</td></tr>`; }
    };
  }

  // TradingView
  const c = document.getElementById('tv_chart_container');
  if (c && typeof TradingView === 'undefined') {
    const s = document.createElement('script');
    s.src = 'https://s3.tradingview.com/tv.js'; s.async = true;
    s.onload = () => { try {
      // eslint-disable-next-line no-undef
      new TradingView.widget({ container_id:'tv_chart_container', autosize:true, symbol:'NASDAQ:AAPL', interval:'D', theme:'dark', locale:'en' });
      const m = document.getElementById('jsLoadedMarker'); if (m) m.textContent = 'JS loaded';
    } catch(e){ console.error(e); } };
    document.head.appendChild(s);
  }
})();
