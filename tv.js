// tiny bootstrap for TV widget
(function(){
  const s = document.createElement('script');
  s.src = '/tvlib.js?v=' + Date.now();
  s.onload = init;
  document.head.appendChild(s);

  function init(){
    const el = document.getElementById('tv_chart_container');
    if(!el || !window.TradingView) return;
    new TradingView.widget({
      autosize: true,
      symbol: "AAPL",
      interval: "D",
      timezone: "exchange",
      theme: "dark",
      style: "1",
      locale: "en",
      hide_top_toolbar: false,
      container_id: "tv_chart_container"
    });
  }
})();
