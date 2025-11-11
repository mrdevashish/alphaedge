// charts.js — handles chart rendering and API fetches
async function loadSymbolInto(id, symbol) {
  const canvas = document.getElementById(id);
  if (!canvas) return console.warn("Missing canvas", id);

  const ctx = canvas.getContext("2d");
  document.dispatchEvent(new CustomEvent("chart:status", {detail:{id, status:"fetching...", ok:true}}));

  try {
    const r = await fetch(`${window.API_BASE_OVERRIDE || ''}/api/candles/${symbol}`);
    const j = await r.json();

    const closes = j.candles.map(c => c.c);
    const labels = j.candles.map((_,i) => i);
    new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: symbol, data: closes }] },
      options: { responsive:true, scales:{x:{display:false},y:{display:true}} }
    });

    document.dispatchEvent(new CustomEvent("chart:status", {detail:{id, status:"ok", ok:true}}));
  } catch (err) {
    console.error("Chart load failed", err);
    document.dispatchEvent(new CustomEvent("chart:status", {detail:{id, status:String(err), ok:false}}));
  }
}
