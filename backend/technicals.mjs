export function SMA(arr, n){ const o=[]; let s=0;
  for(let i=0;i<arr.length;i++){ s+=arr[i]; if(i>=n) s-=arr[i-n]; o.push(i>=n-1? s/n : null) } return o }
export function RSI(closes, period=14){
  let gains=0,losses=0; const r=[];
  for(let i=1;i<closes.length;i++){
    const ch=closes[i]-closes[i-1];
    const g=Math.max(ch,0), l=Math.max(-ch,0);
    if(i<=period){ gains+=g; losses+=l; r.push(null); if(i===period){ const rs=(gains/period)/((losses||1)/period); r[i-1]=100-(100/(1+rs)) } }
    else{ const prev=r[i-2]; const avgG=((gains*(period-1))+g)/period; const avgL=((losses*(period-1))+l)/period;
      gains=avgG; losses=avgL; const rs=(avgG)/((avgL)||1); r.push(100-(100/(1+rs))) }
  }
  return [null,...r];
}
export function momentum(closes, n=20){ const m=[]; for(let i=0;i<closes.length;i++){ m.push(i>=n? (closes[i]-closes[i-n]) / closes[i-n] *100 : null) } return m }
