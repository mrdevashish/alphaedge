(async function(){
  const users = [
    {name:'Meera Kulkarni', email:'meera@example.com', joined:'2025-10-21'},
    {name:'Arjun Rao', email:'arjun@example.com', joined:'2025-11-02'},
  ];
  const subs = [
    {email:'meera@example.com', plan:'monthly', expires:'2026-01-02'},
    {email:'arjun@example.com', plan:'weekly',  expires:'2025-11-20'},
  ];
  const uBody=document.querySelector('#tblUsers tbody');
  const sBody=document.querySelector('#tblSubs tbody');
  uBody.innerHTML = users.map(u=>`<tr><td>${u.name}</td><td>${u.email}</td><td>${u.joined}</td></tr>`).join('');
  sBody.innerHTML = subs.map(s=>`<tr><td>${s.email}</td><td>${s.plan}</td><td>${s.expires}</td></tr>`).join('');
})();
