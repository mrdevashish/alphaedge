(async function(){
  const grid = document.getElementById('learnGrid');
  if(!grid) return;
  try{
    const res = await fetch('assets/data/books.json');
    const list = await res.json();
    grid.innerHTML = list.map(x=>`
      <div class="card">
        <div class="badge">${x.type}</div>
        <h3>${x.title}</h3>
        <p class="lead">${x.note||''}</p>
        <a class="btn" ${x.href.startsWith('http')?'target="_blank"':''} href="${x.href}">Open</a>
      </div>`).join('');
  }catch(e){
    grid.innerHTML = '<div class="card">Could not load resources.</div>';
  }
})();
