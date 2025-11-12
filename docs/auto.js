// === API base ===
// in production use Render; in local dev use 127.0.0.1:8080
const API_BASE = (location.hostname === "127.0.0.1" || location.hostname === "localhost")
  ? "https://alphaedge-backend.onrender.com"
  : "https://alphaedge-backend.onrender.com";

// Helper
async function api(path, body){
  const r = await fetch(`$https://alphaedge-backend.onrender.com${path}`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(body || {})
  });
  return r.json();
}

// Paint org info in navbar (optional)
(async ()=>{
  try{
    const r = await fetch(`$https://alphaedge-backend.onrender.com/config/public`);
    const j = await r.json();
    if (j?.ok){
      const el = document.querySelector("#orgName");
      if (el) el.textContent = j.org?.name || "AlphaEdge";
    }
  }catch(e){}
})();

// Analyzer button (example)
window.runAnalyze = async ()=>{
  const sym = document.querySelector("#aiSymbol")?.value?.trim();
  const tf  = document.querySelector("#aiTf")?.value || "1d";
  const out = document.querySelector("#aiOut");
  out.textContent = "Loading...";
  try{
    const j = await api("/api/ai/analyze", { symbol: sym, tf });
    out.textContent = JSON.stringify(j, null, 2);
  }catch(e){
    out.textContent = "Error: "+String(e);
  }
};

// Screener
window.runScreener = async ()=>{
  const box = document.querySelector("#scrList");
  const tf  = document.querySelector("#scrTf")?.value || "1d";
  const out = document.querySelector("#scrBody");
  out.innerHTML = "";
  try{
    const symbols = box.value.split(",").map(s=>s.trim()).filter(Boolean);
    const j = await api("/api/screener", { symbols, tf });
    if (j?.ok){
      j.results.forEach(r=>{
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${r.symbol}</td><td>${r.momentum}</td><td>${r.vsSMA20}</td>`;
        out.appendChild(tr);
      });
    }else{
      out.innerHTML = `<tr><td colspan="3">Error: ${j?.error||"unknown"}</td></tr>`;
    }
  }catch(e){
    out.innerHTML = `<tr><td colspan="3">Error: ${String(e)}</td></tr>`;
  }
};
