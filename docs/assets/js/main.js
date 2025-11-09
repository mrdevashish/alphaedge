/* AlphaEdge Frontend Controller */
const API_BASE = "https://alphaedge-backend.onrender.com"; // your live backend
const $ = (q,root=document)=>root.querySelector(q);
const $$ = (q,root=document)=>Array.from(root.querySelectorAll(q));

const auth = {
  token: () => localStorage.getItem("ae_token"),
  save: (t) => localStorage.setItem("ae_token", t),
  clear: () => localStorage.removeItem("ae_token"),
  headers() {
    const h = {"Content-Type":"application/json"};
    if (this.token()) h["Authorization"] = "Bearer " + this.token();
    return h;
  }
};

async function getJSON(url, opts={}) {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error((await r.text()) || r.statusText);
  return r.headers.get("content-type")?.includes("application/json") ? r.json() : {};
}

function setActiveNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  $$(".menu a").forEach(a => a.classList.toggle("active", a.getAttribute("href").endsWith(path)));
  const loginBtn = $("#loginBtn"); const logoutBtn = $("#logoutBtn");
  if (loginBtn && logoutBtn){ const logged = !!auth.token(); loginBtn.style.display = logged?"none":""; logoutBtn.style.display = logged?"":"none"; }
}

async function checkSubscriptionAndGate(){
  const guard = $("[data-guard='subscription']");
  if (!guard) return;
  if (!auth.token()){
    guard.innerHTML = `<div class="alert err">Please <a href="login.html">log in</a> to view suggestions.</div>`;
    return;
  }
  try{
    const data = await getJSON(`${API_BASE}/api/subscriptions/me`, { headers: auth.headers() });
    if (!data.subscription){
      guard.innerHTML = `<div class="alert">No active plan. <a class="btn" href="plans.html">Choose a plan</a></div>`;
    } else {
      guard.querySelector?.(".locked")?.remove();
      guard.classList.remove("locked");
    }
  }catch(e){
    guard.innerHTML = `<div class="alert err">Error fetching subscription: ${e.message}</div>`;
  }
}

function injectSampleSuggestions(){
  const tb = $("#suggestionBody"); if (!tb) return;
  const rows = [
    {sym:"TCS", type:"BUY", entry:3890, sl:3825, tgt:3990, conf:92},
    {sym:"INFY", type:"BUY", entry:1555, sl:1520, tgt:1610, conf:88},
    {sym:"HDFCBANK", type:"SELL", entry:1495, sl:1518, tgt:1450, conf:84},
    {sym:"RELIANCE", type:"BUY", entry:2475, sl:2430, tgt:2550, conf:81},
  ];
  tb.innerHTML = rows.map(r => `
    <tr>
      <td class="mono">${r.sym}</td>
      <td>${r.type==="BUY" ? `<span class="tag">BUY</span>` : `<span class="tag" style="background:rgba(239,68,68,.15);color:#ef9ca9">SELL</span>`}</td>
      <td>₹${r.entry}</td><td>₹${r.sl}</td><td>₹${r.tgt}</td>
      <td>${r.conf}%</td>
    </tr>
  `).join("");
}

async function handleAuthForms(){
  const reg = $("#registerForm");
  if (reg){
    reg.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const body = { name: reg.name.value.trim(), email: reg.email.value.trim(), password: reg.password.value };
      try{
        const data = await getJSON(`${API_BASE}/api/auth/register`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
        auth.save(data.token); location.href = "plans.html";
      }catch(err){ $("#regMsg").textContent = err.message; $("#regMsg").className="alert err"; }
    });
  }
  const log = $("#loginForm");
  if (log){
    log.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const body = { email: log.email.value.trim(), password: log.password.value };
      try{
        const data = await getJSON(`${API_BASE}/api/auth/login`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
        auth.save(data.token); location.href = "suggestions.html";
      }catch(err){ $("#logMsg").textContent = err.message; $("#logMsg").className="alert err"; }
    });
  }
  const logout = $("#logoutBtn");
  if (logout){ logout.addEventListener("click", ()=>{ auth.clear(); location.href="index.html"; }); }
}

function wirePricingButtons(){
  $$(".choose-plan").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      if (!auth.token()){ location.href="login.html"; return; }
      const plan = btn.dataset.plan;
      try{
        const res = await getJSON(`${API_BASE}/api/subscriptions/activate`, {
          method:"POST",
          headers: auth.headers(),
          body: JSON.stringify({ plan, days: plan==="weekly"?7: plan==="yearly"?365:30 })
        });
        alert(`Activated ${plan} plan until ${new Date(res.active_until).toDateString()}`);
        location.href = "suggestions.html";
      }catch(e){ alert("Activation error: " + e.message); }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  handleAuthForms();
  checkSubscriptionAndGate();
  injectSampleSuggestions();
  wirePricingButtons();
});
