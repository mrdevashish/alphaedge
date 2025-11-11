const store = {
  get k(){return "alphaedge_store_v1"},
  read(){
    try{ return JSON.parse(localStorage.getItem(this.k)) || {watchlist:[],alerts:[]} }
    catch(_){ return {watchlist:[],alerts:[]} }
  },
  write(data){ localStorage.setItem(this.k, JSON.stringify(data)); },
  pushWL(item){
    const db=this.read();
    if(!db.watchlist.find(x=>x.symbol===item.symbol && x.exch===item.exch)){
      db.watchlist.push({...item, id:Date.now()});
      this.write(db);
    }
    return db.watchlist;
  },
  delWL(id){
    const db=this.read(); db.watchlist=db.watchlist.filter(x=>String(x.id)!==String(id)); this.write(db);
    return db.watchlist;
  },
  pushAL(item){
    const db=this.read(); db.alerts.push({...item,id:Date.now(),active:true}); this.write(db); return db.alerts;
  },
  delAL(id){
    const db=this.read(); db.alerts=db.alerts.filter(x=>String(x.id)!==String(id)); this.write(db); return db.alerts;
  },
  toggleAL(id){
    const db=this.read(); const i=db.alerts.findIndex(x=>String(x.id)===String(id));
    if(i>=0){ db.alerts[i].active=!db.alerts[i].active; this.write(db); }
    return db.alerts;
  }
};

function $(q){ return document.querySelector(q); }
function el(tag, html){ const e=document.createElement(tag); e.innerHTML=html; return e; }

function mountIndex(){
  const wlBox=$("#watchlist"), alBox=$("#alerts");
  function renderWL(){
    wlBox.innerHTML="";
    store.read().watchlist.forEach(x=>{
      const node=el("div", `
        <div class="item">
          <div>${x.exch}:${x.symbol} <span class="badge">${x.note||""}</span></div>
          <span>
            <button onclick="openPro('${x.exch}','${x.symbol}')">Open</button>
            <button onclick="delWL('${x.id}')">✕</button>
          </span>
        </div>`);
      wlBox.appendChild(node.firstElementChild);
    });
  }
  function renderAL(){
    alBox.innerHTML="";
    store.read().alerts.forEach(x=>{
      const node=el("div", `
        <div class="item">
          <div>${x.symbol} @ ${x.price} <span class="badge">${x.active?"active":"off"}</span></div>
          <span>
            <button onclick="toggleAL('${x.id}')">Toggle</button>
            <button onclick="delAL('${x.id}')">✕</button>
          </span>
        </div>`);
      alBox.appendChild(node.firstElementChild);
    });
  }
  window.addWL=()=>{ const exch=$("#exch").value; const symbol=$("#symbol").value||"RELIANCE";
    store.pushWL({exch,symbol}); renderWL(); };
  window.delWL=(id)=>{ store.delWL(id); renderWL(); };
  window.addAL=()=>{ const symbol=$("#symbol").value||"RELIANCE"; const price=Number(prompt("Alert price?"));
    if(!isNaN(price)) { store.pushAL({symbol,price}); renderAL(); } };
  window.delAL=(id)=>{ store.delAL(id); renderAL(); };
  window.toggleAL=(id)=>{ store.toggleAL(id); renderAL(); };

  renderWL(); renderAL();
}
window.openPro = (exch,sym,tf="D")=>{
  const u=new URL(location.origin + "/alphaedge/pro.html"); // GH Pages subpath
  u.searchParams.set("exch",exch||($("#exch")?.value||"NSE"));
  u.searchParams.set("symbol",sym||($("#symbol")?.value||"RELIANCE"));
  u.searchParams.set("tf",tf);
  location.href=u.toString();
};

function mountPro(){
  const params=new URL(location.href).searchParams;
  const exch=params.get("exch")||"NSE";
  const symbol=params.get("symbol")||"RELIANCE";
  const tf=params.get("tf")||"D";
  $("#exch").value=exch; $("#symbol").value=symbol; $("#tf").value=tf;

  function tvSymbol(e,s){
    if(e==="GLOBAL") return s || "AAPL";
    const map={NSE:"NSE:",BSE:"BSE:"}; return (map[e]||"NSE:")+(s||"RELIANCE");
  }
  const full = tvSymbol(exch, symbol);
  const script=document.createElement("script"); script.src="https://s3.tradingview.com/tv.js";
  script.onload=()=>{
    try{
      // eslint-disable-next-line no-undef
      new TradingView.widget({
        symbol: full,
        interval: tf,
        container_id: "tvchart",
        autosize: true,
        theme: "dark",
        timezone: "Asia/Kolkata",
        locale: "en",
        withdateranges: true,
        allow_symbol_change: true,
        studies: ["MACD@tv-basicstudies","RSI@tv-basicstudies","MAExp@tv-basicstudies"],
      });
      $("#wdg").textContent="widget: ok (data by TradingView)";
    }catch(e){ $("#wdg").textContent="widget: error"; }
  };
  document.body.appendChild(script);

  $("#load").onclick=()=>{
    const e=$("#exch").value, s=$("#symbol").value||"RELIANCE", t=$("#tf").value||"D";
    const u=new URL(location.href); u.searchParams.set("exch",e); u.searchParams.set("symbol",s); u.searchParams.set("tf",t);
    location.href=u.toString();
  };
}

document.addEventListener("DOMContentLoaded", ()=>{
  if(document.body.dataset.page==="index") mountIndex();
  if(document.body.dataset.page==="pro") mountPro();
});
