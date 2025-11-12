const apiBase = location.origin.includes(':8080') ? 'http://127.0.0.1:5000' : ''

// --- dropdown suggest (datalist)
const dl = document.getElementById('symList')
const symInput = document.getElementById('symbol')
symInput.addEventListener('input', async (e)=>{
  const q=e.target.value.trim(); if(q.length<1) return
  const r = await fetch(`${apiBase}/api/suggest?q=${encodeURIComponent(q)}`)
  const j = await r.json()
  dl.innerHTML = j.quotes.map(s=>`<option value="${s.symbol}">${s.name} (${s.exch})</option>`).join('')
})

// --- Analyze button
document.getElementById('analyzeBtn').addEventListener('click', async ()=>{
  const symbol = symInput.value.trim() || 'AAPL'
  const tf = document.getElementById('tf').value
  const r = await fetch(`${apiBase}/api/analyze`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({symbol, tf})})
  const j = await r.json()
  document.getElementById('aiOut').textContent = JSON.stringify(j, null, 2)
})

// --- Screener
document.getElementById('scrBtn').addEventListener('click', async ()=>{
  const list = document.getElementById('scrList').value.split(',').map(x=>x.trim().toUpperCase()).filter(Boolean)
  const tf = document.getElementById('scrTf').value
  const r = await fetch(`${apiBase}/api/screener`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({symbols:list, tf})})
  const j = await r.json()
  const rows = j.results.map(x=>`<tr><td>${x.symbol}</td><td>${x.momentum!=null? x.momentum.toFixed(2)+'%':'-'}</td></tr>`).join('')
  document.getElementById('scrBody').innerHTML = rows
})
