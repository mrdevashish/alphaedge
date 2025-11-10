(function(){
  const email = localStorage.getItem('ae_email');
  const token = localStorage.getItem('ae_token');
  const menu  = document.querySelector('.menu');
  if(!menu) return;
  // clear state first
  // Add Account/Logout when logged in; else show Login/Register
  if(token){
    // remove duplicate buttons if present
    menu.querySelectorAll('.guest-only').forEach(x=>x.remove());
    if(!menu.querySelector('a[href="account.html"]')){
      const a = document.createElement('a'); a.href='account.html'; a.textContent='Account'; menu.appendChild(a);
    }
    if(!menu.querySelector('#logoutBtn')){
      const b = document.createElement('a'); b.href='#'; b.id='logoutBtn'; b.className='btn'; b.textContent='Logout';
      b.onclick = (e)=>{e.preventDefault(); localStorage.removeItem('ae_token'); localStorage.removeItem('ae_email'); location.href='index.html';};
      menu.appendChild(b);
    }
  } else {
    // make sure login/register exist
    if(!menu.querySelector('a[href="login.html"]')){
      const l=document.createElement('a'); l.href='login.html'; l.className='btn guest-only'; l.textContent='Login'; menu.appendChild(l);
    }
    if(!menu.querySelector('a[href="register.html"]')){
      const r=document.createElement('a'); r.href='register.html'; r.className='btn primary guest-only'; r.textContent='Get Pro'; menu.appendChild(r);
    }
  }
})();
