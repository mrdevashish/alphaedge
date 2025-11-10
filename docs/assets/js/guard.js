window.AE = window.AE||{};
AE.guard = function(opts={}){
  const token = localStorage.getItem('ae_token');
  if(!token){ alert('Please login to access this page.'); location.href='login.html'; return false; }
  return true;
};
