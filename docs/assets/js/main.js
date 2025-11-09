(function(){
  const el=document.getElementById('miniChart'); if(!el) return;
  const ctx=el.getContext('2d');
  const w=el.width=el.clientWidth*2, h=el.height=el.clientHeight*2;
  ctx.scale(2,2);
  // gradient bg glass
  const grd=ctx.createLinearGradient(0,0,w,0);
  grd.addColorStop(0,'#102042'); grd.addColorStop(1,'#0f1840');
  ctx.fillStyle=grd; ctx.fillRect(0,0,w,h);
  // fake price series
  const N=48, mid=h*0.55; let x=10,y=mid, step=(w-20)/N;
  ctx.lineWidth=2; ctx.strokeStyle='#66e0d8';
  ctx.beginPath(); ctx.moveTo(x,y);
  for(let i=0;i<N;i++){ y+= (Math.sin(i/3)+Math.random()-0.4)*6; ctx.lineTo(x+=step,y); }
  ctx.stroke();
  // axis fade
  ctx.strokeStyle='#2a3b63'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(10,h-18); ctx.lineTo(w-10,h-18); ctx.stroke();
})();
