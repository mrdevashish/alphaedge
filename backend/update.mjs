import fetch from 'node-fetch'
import { cacheSet, putCandles } from './db.mjs'
import symbols from './symbols.json' assert { type:'json' }

const tf='1d'
function yahoo(sym){ return `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1y` }
function norm(j){
  const r = j.chart?.result?.[0]; if(!r) return []
  const t=r.timestamp||[], q=r.indicators?.quote?.[0]||{}
  const o=q.open||[],h=q.high||[],l=q.low||[],c=q.close||[],v=q.volume||[]
  const out=[]; for(let i=0;i<t.length;i++){ if(o[i]==null||h[i]==null||l[i]==null||c[i]==null) continue; out.push({t:t[i]*1000,o:o[i],h:h[i],l:l[i],c:c[i],v:v[i]||0}) }
  return out
}
for(const [k,v] of Object.entries(symbols.map)){
  const yh = v.yahoo
  try{
    const r = await fetch(yahoo(yh), {headers:{'User-Agent':'Mozilla/5.0'}})
    const rows = norm(await r.json())
    cacheSet(`yh:${yh}:${tf}`, rows)
    putCandles(k, tf, rows)
    console.log('updated', k)
  }catch(e){ console.log('skip', k, e.message) }
}
