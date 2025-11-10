(function(id){
  if(!id) return;
  const s=document.createElement('script'); s.async=1; s.src=`https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[]; function g(){dataLayer.push(arguments)}; g('js',new Date()); g('config', id);
})('G-XXXXXXX'); // replace with your GA ID
