let JWT=null;
const $=s=>document.querySelector(s);
const api=(path,opts={})=>fetch(`${window.API_BASE}${path}`,{
  ...opts,headers:{'Content-Type':'application/json', ...(opts.headers||{}), ...(JWT?{'Authorization':'Bearer '+JWT}:{})}
});

async function login(){
  const email=$('#email').value.trim(), password=$('#password').value;
  const r=await api('/api/auth/login',{method:'POST',body:JSON.stringify({email,password})});
  if(!r.ok){alert('Login failed');return}
  const j=await r.json(); JWT=j.token||j.accessToken||j.jwt||null;
  localStorage.setItem('ADMIN_JWT',JWT);
  await refresh();
}
async function refresh(){
  JWT=JWT||localStorage.getItem('ADMIN_JWT');
  if(!JWT){$('#users').textContent='Login required';$('#subs').textContent='Login required';return}
  const [u,s]=await Promise.all([
    api('/api/admin/users').then(r=>r.json()).catch(()=>[]),
    api('/api/admin/subscriptions').then(r=>r.json()).catch(()=>[])
  ]);
  $('#users').innerHTML = Array.isArray(u)&&u.length?('<ul>'+u.map(x=>`<li>${x.email} • ${x.name||'-'}</li>`).join('')+'</ul>'):'—';
  $('#subs').innerHTML  = Array.isArray(s)&&s.length?('<ul>'+s.map(x=>`<li>${x.email} • ${x.plan} • expires ${new Date(x.expiresAt).toLocaleDateString()}</li>`).join('')+'</ul>'):'—';
}
async function activate(){
  JWT=JWT||localStorage.getItem('ADMIN_JWT');
  const email=$('#actEmail').value.trim(), plan=$('#actPlan').value, days=+$('#actDays').value||30;
  const r=await api('/api/admin/activate',{method:'POST',body:JSON.stringify({email,plan,days})});
  const j=await r.json().catch(()=>({}));
  $('#msg').textContent=r.ok?('Activated '+email+' → '+plan+' for '+days+'d'):('Error: '+(j.message||r.statusText));
  if(r.ok) refresh();
}
$('#loginBtn').onclick=login;
$('#refreshBtn').onclick=refresh;
$('#actBtn').onclick=activate;
refresh();
