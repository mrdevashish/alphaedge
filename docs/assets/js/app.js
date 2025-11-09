(function(){
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const burger=$('#burger'), nav=$('#navMenu'); if(burger&&nav){ burger.onclick=()=>nav.classList.toggle('hidden'); }
  const path=(location.pathname.replace(/\/+$/,'').split('/').pop()||'index.html');
  $$('#mainNav a').forEach(a=>{
    const ap=a.getAttribute('href').replace(/\/+$/,'');
    if((path===''&&ap.endsWith('index.html'))||ap.endsWith(path)) a.classList.add('active');
  });
})();
