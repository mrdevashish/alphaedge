(function(){
  const items = [
    {type:'book', title:'Technical Analysis — Free PDF', desc:'Classic TA notes for beginners.', cta:'Download',
     href:'https://www.cs.cmu.edu/~cosal/comp-learning-book/ta-notes.pdf'},
    {type:'book', title:'Risk Management Primer', desc:'Short primer on position sizing & stops.', cta:'View',
     href:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2874199'},
    {type:'poster', title:'Candlestick Poster (A3 Print)', desc:'High-res cheat-sheet poster (PNG).', cta:'Download',
     href:'assets/img/candles-cheatsheet.png'},
    {type:'chart', title:'Position Sizing Sheet (CSV)', desc:'Simple R-multiple size sheet.', cta:'Download',
     href:'assets/sample/position-sizing.csv'},
    {type:'merch', title:'Infinity Tee (Mockup)', desc:'Community tee mockup (coming soon).', cta:'Notify me',
     href:'#'}
  ];
  const grid = document.getElementById('prodGrid');
  grid.innerHTML = items.map(x=>`
    <div class="card">
      <div class="badge">${x.type}</div>
      <h3>${x.title}</h3>
      <p class="lead">${x.desc}</p>
      <a class="btn btn-primary" ${x.href.startsWith('http')?'target="_blank"':''} href="${x.href}">${x.cta}</a>
    </div>`).join('');
})();
