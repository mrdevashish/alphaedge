/** API base auto-detect (local dev or Render) */
const API_BASE = (typeof window !== "undefined" && window.API_BASE_OVERRIDE)
  ? window.API_BASE_OVERRIDE
  : "http://127.0.0.1:5000";

/** Fetch OHLC candles from backend */
export async function fetchCandles(symbol){
  const url = `${API_BASE}/api/candles/${encodeURIComponent(symbol)}`;
  const r = await fetch(url, { cache: "no-store" });
  if(!r.ok) throw new Error(`API ${r.status}`);
  const data = await r.json();
  return data.candles || [];
}
