const API_BASE = "https://alphaedge-backend.onrender.com";
window.check = async () => {
  const el = document.getElementById('status');
  try {
    const r = await fetch(API_BASE + "/health");
    el.textContent = r.ok ? "ONLINE ✅" : ("OFFLINE ❌ " + r.status);
  } catch (e) {
    el.textContent = "OFFLINE ❌ " + e;
  }
};
