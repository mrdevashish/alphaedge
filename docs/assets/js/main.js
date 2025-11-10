(function(){
  // Simple mini candlestick using Canvas (no libs)
  const el=document.getElementById('miniChart'); if(!el) return;
  const ctx=el.getContext('2d'); const W=el.width, H=el.height;
  const data=[ [100,105,95,102],[102,108,100,106],[106,109,103,104],
               [104,107,101,106],[106,112,105,111],[111,115,109,114] ];
  // scale
  const lo=Math.min(...data.map(d=>d[2])), hi=Math.max(...data.map(d=>d[1]));
  const y=v=>H-((v-lo)/(hi-lo))*H; const xStep=W/(data.length+1);
  ctx.clearRect(0,0,W,H); ctx.lineWidth=2; ctx.translate(8,0);
  data.forEach((d,i)=>{
    const [o,h,l,c]=d; const x=(i+1)*xStep;
    ctx.strokeStyle=c>=o?'#16a34a':'#ef4444';
    // wick
    ctx.beginPath(); ctx.moveTo(x,y(h)); ctx.lineTo(x,y(l)); ctx.stroke();
    // body
    const top=y(Math.max(o,c)), bot=y(Math.min(o,c)); const w=14;
    ctx.fillStyle=c>=o?'#22c55e':'#f87171'; ctx.fillRect(x-w/2,top,w,Math.max(4,bot-top));
  });
  ctx.setTransform(1,0,0,1,0,0);
})();
