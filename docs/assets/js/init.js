import { loadSymbolInto } from "./charts.js";
import { debug } from "./api.js";

// Add a little debug panel on the page so you can see errors on phone
(function addDebugBox(){
  const box = document.createElement("pre");
  box.id = "debug_box";
  box.style.cssText="position:fixed;right:8px;bottom:8px;width:46vw;max-width:360px;height:28vh;overflow:auto;background:#0e1320cc;border:1px solid #22304d;color:#cde3ff;padding:8px;border-radius:10px;font:12px/1.4 ui-monospace,Menlo,Consolas;z-index:9999";
  box.textContent = "debug log…\n";
  document.addEventListener("DOMContentLoaded",()=>document.body.appendChild(box));
})();

// Kick off one or more minis
document.addEventListener("DOMContentLoaded", async ()=>{
  // Make sure canvases exist on the page
  await loadSymbolInto("mini-reliance","RELIANCE");
  // add more lines if you have more canvases:
  // await loadSymbolInto("mini-tcs","TCS");
});
