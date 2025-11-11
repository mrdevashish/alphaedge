(function () {
  const b = document.createElement('div');
  b.id = 'debug-banner';
  b.style.cssText = 'position:fixed;left:8px;bottom:8px;padding:6px 10px;border-radius:6px;background:#111;color:#0f0;font:12px/1.2 monospace;z-index:9999;opacity:.8';
  b.textContent = 'debug: init  API=' + (window.API_BASE_URL || 'local');
  document.body.appendChild(b);
})();
