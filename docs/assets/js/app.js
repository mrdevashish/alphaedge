(function () {
  const $ = (s, ctx=document)=>ctx.querySelector(s);
  const $$= (s, ctx=document)=>Array.from(ctx.querySelectorAll(s));

  // Mobile nav
  const burger = $('#burger');
  const nav    = $('#navMenu');
  if (burger && nav) {
    burger.addEventListener('click', ()=> nav.classList.toggle('hidden'));
  }

  // Active nav link by pathname
  const path = location.pathname.replace(/\/+$/, '').split('/').pop() || 'index.html';
  $$('#mainNav a').forEach(a=>{
    const ap = a.getAttribute('href').replace(/\/+$/, '');
    if ((path === '' && ap.endsWith('index.html')) || ap.endsWith(path)) {
      a.classList.add('active');
    }
  });
})();
