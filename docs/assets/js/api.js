const FALLBACK_API = "";
const API_BASE =
  (typeof window !== "undefined" && window.API_BASE_OVERRIDE) || FALLBACK_API;

export async function fetchCandles(symbol) {
  const url = `${API_BASE}/api/candles/${encodeURIComponent(symbol)}`;
  const r = await fetch(url, { headers: { "Accept": "application/json" }});
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}
