(function(){
  const el = document.getElementById('site-nav');
  if(!el) return;

  el.innerHTML = `
    <div class="nav-inner">
      <a class="brand" href="./index.html">
        <img src="assets/img/logo-infinity.svg" alt="Infinity Invest" height="32"/>
      </a>
      <nav class="links">
        <a href="./index.html">Home</a>
        <a href="./products.html">Products</a>
        <a href="./learn.html">Learn</a>
        <a href="./about.html">About</a>
      </nav>
      <div class="auth">
        <a class="btn ghost" href="./login.html">Login</a>
        <a class="btn primary" href="./register.html">Register</a>
      </div>
    </div>
  `;
})();
