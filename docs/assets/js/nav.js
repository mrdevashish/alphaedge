(function(){
  const toggle = document.querySelector('#navToggle');
  const menu   = document.querySelector('.menu');
  if(!toggle || !menu) return;
  toggle.addEventListener('click',()=>menu.classList.toggle('open'));
})();
