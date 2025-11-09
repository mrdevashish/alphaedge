const API_BASE = "https://alphaedge-backend.onrender.com";
const $ = (q,root=document)=>root.querySelector(q);
const $$ = (q,root=document)=>Array.from(root.querySelectorAll(q));
const auth = {
  token:()=>localStorage.getItem("ae_token"),
  save:(t)=>localStorage.setItem("ae_token",t),
  clear:()=>localStorage.removeItem("ae_token"),
  headers(){ const h={"Content-Type":"application/json"}; if(this.token()) h.Authorization="Bearer "+this.token(); return h; }
};
async function getJSON(u,o={}){const r=await fetch(u,o); if(!r.ok) throw new Error(await r.text()||r.statusText); return r.headers.get("content-type")?.includes("application/json")? r.json():{};}
function setActiveNav(){const p=location.pathname.split("/").pop()||"index.html";$$(".menu a").forEach(a=>a.classList.toggle("active",a.getAttribute("href").endsWith(p)));const lb=$("#loginBtn"),lo=$("#logoutBtn");if(lb&&lo){const ok=!!auth.token();lb.style.display=ok?"none":"";lo.style.display=ok?"":"none";lo.onclick=()=>{auth.clear(); location.href="index.html";}}}
async function checkSubscriptionAndGate(){const g=document.querySelector("[data-guard='subscription']");if(!g) return;if(!auth.token()){const l=g.querySelector(".locked");if(l) l.innerHTML='Please log in to view suggestions.';return;}try{const d=await getJSON(`${API_BASE}/api/subscriptions/me`,{headers:auth.headers()});const l=g.querySelector(".locked");if(!d.subscription){if(l) l.innerHTML='No active plan. <a class="btn" href="plans.html">Choose a plan</a>';}else{l?.remove();}}catch(e){const l=g.querySelector(".locked");if(l) l.textContent="Error: "+e.message;}}
function injectSampleSuggestions(){const tb=$("#suggestionBody"); if(!tb) return; const rows=[{sym:"TCS",type:"BUY",entry:3890,sl:3825,tgt:3990,conf:92},{sym:"INFY",type:"BUY",entry:1555,sl:1520,tgt:1610,conf:88},{sym:"HDFCBANK",type:"SELL",entry:1495,sl:1518,tgt:1450,conf:84},{sym:"RELIANCE",type:"BUY",entry:2475,sl:2430,tgt:2550,conf:81}]; tb.innerHTML=rows.map(r=>`<tr><td class="mono">${r.sym}</td><td>${r.type==="BUY"?`<span class="tag">BUY</span>`:`<span class="tag" style="background:#fee2e2;color:#991b1b">SELL</span>`}</td><td>₹${r.entry}</td><td>₹${r.sl}</td><td>₹${r.tgt}</td><td>${r.conf}%</td></tr>`).join("");}
document.addEventListener("DOMContentLoaded",()=>{setActiveNav();checkSubscriptionAndGate();injectSampleSuggestions();});
