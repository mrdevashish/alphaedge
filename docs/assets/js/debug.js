(function(){
  const b = document.createElement('div');
  b.id = 'debug-banner';
  b.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:9999;background:#111;color:#0f0;padding:6px 10px;font:12px/1.2 monospace;border-radius:6px;opacity:0.9';
  b.textContent = 'debug: init… backend='+(window.API_BASE_OVERRIDE||'local');
  document.addEventListener('chart:status', e=>{
    b.textContent = 'chart '+e.detail.id+': '+e.detail.status;
    b.style.color = e.detail.ok ? '#0f0' : '#f33';
  });
  document.body.appendChild(b);
})();
