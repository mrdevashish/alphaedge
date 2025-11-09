/* AlphaEdge frontend glue */
const API_BASE = "https://alphaedge-backend.onrender.com"; // change if your URL differs
const TOKEN_KEY = "ae_token";
const EMAIL_KEY = "ae_email";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function setToken(t){ localStorage.setItem(TOKEN_KEY, t); }
function getToken(){ return localStorage.getItem(TOKEN_KEY); }
function setEmail(e){ localStorage.setItem(EMAIL_KEY, e||""); }
function getEmail(){ return localStorage.getItem(EMAIL_KEY)||""; }
function logout(){ localStorage.removeItem(TOKEN_KEY); location.href="login.html"; }

async function api(method, path, body, needAuth=false, rawHeaders={}) {
  const headers = { "Content-Type":"application/json", ...rawHeaders };
  if(needAuth && getToken()) headers.Authorization = "Bearer " + getToken();
  const r = await fetch(API_BASE + path, { method, headers, body: body?JSON.stringify(body):undefined });
  if(!r.ok) throw new Error((await r.text())||("HTTP "+r.status));
  return r.headers.get("content-type")?.includes("application/json") ? r.json() : r.text();
}

async function checkActiveSubscription() {
  try{
    const res = await api("GET","/api/subscriptions/me",null,true);
    return !!res.subscription;
  }catch(e){ return false; }
}

async function guardSuggestions(){
  if(!getToken()){ location.href="login.html"; return; }
  const ok = await checkActiveSubscription();
  if(!ok){ location.href="plans.html"; }
}

async function handleRegister(){
  const f = $("#register-form"); if(!f) return;
  f.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const name=f.name.value.trim(), email=f.email.value.trim(), password=f.password.value;
    try{
      await api("POST","/api/auth/register",{name,email,password});
      const j = await api("POST","/api/auth/login",{email,password});
      setToken(j.token); setEmail(email);
      location.href="suggestions.html";
    }catch(err){ alert("Register failed: "+err.message); }
  });
}

async function handleLogin(){
  const f = $("#login-form"); if(!f) return;
  f.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email=f.email.value.trim(), password=f.password.value;
    try{
      const j = await api("POST","/api/auth/login",{email,password});
      setToken(j.token); setEmail(email);
      location.href="suggestions.html";
    }catch(err){ alert("Login failed: "+err.message); }
  });
}

function renderUserBadge(){
  const el=$("#user-badge"); if(!el) return;
  const em=getEmail();
  el.textContent = getToken()? (em||"Logged in") : "Guest";
}

async function wirePlans(){
  const btns = $$(".buy-btn");
  if(!btns.length) return;
  btns.forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      if(!getToken()){ alert("Please login first"); location.href="login.html"; return; }
      // For now: simulate success by directly activating (works without Razorpay)
      const plan = btn.dataset.plan;
      try{
        await api("POST","/api/subscriptions/activate",{ plan, days: plan==="yearly"?365:(plan==="weekly"?7:30) }, true);
        alert("Plan activated! Redirecting to suggestions.");
        location.href="suggestions.html";
      }catch(e){ alert("Activation failed: "+e.message); }
    });
  });
}

function wireLogout(){
  $$("#logout, .logout").forEach(el=> el.addEventListener("click", e=>{ e.preventDefault(); logout(); }));
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderUserBadge();
  handleRegister();
  handleLogin();
  wirePlans();
});
