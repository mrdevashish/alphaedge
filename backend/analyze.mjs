import { SMA, RSI, momentum } from './technicals.mjs'
export function analyzeSeries(candles){
  const closes=candles.map(c=>c.c)
  const sma20=SMA(closes,20), sma50=SMA(closes,50), rsi=RSI(closes,14), mom=momentum(closes,20)
  const last=closes.length-1
  const insights=[]
  if(sma20[last] && sma50[last]){
    if(sma20[last]>sma50[last] && sma20[last-1]<=sma50[last-1]) insights.push({signal:"Buy",reason:"SMA20 crossed above SMA50"})
    if(sma20[last]<sma50[last] && sma20[last-1]>=sma50[last-1]) insights.push({signal:"Sell",reason:"SMA20 crossed below SMA50"})
  }
  if(rsi[last]){
    if(rsi[last]<30) insights.push({signal:"Buy",reason:"RSI oversold"})
    if(rsi[last]>70) insights.push({signal:"Sell",reason:"RSI overbought"})
  }
  if(mom[last]!=null){
    if(mom[last]>0) insights.push({signal:"Hold",reason:"Positive momentum"})
    else insights.push({signal:"Caution",reason:"Negative momentum"})
  }
  return { ok:true, insights }
}
