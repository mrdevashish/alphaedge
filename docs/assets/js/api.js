// api.js — small fetch wrapper with Render override + debug
export const API_BASE =
  (typeof window!=="undefined" && window.API_BASE_OVERRIDE) || "http://127.0.0.1:5000";

export async function api(path, init={}) {
  const url = API_BASE + path;
  const r = await fetch(url, {
    ...init,
    headers: { "Content-Type":"application/json", ...(init.headers||{}) }
  });
  return r;
}

export async function apiJSON(path, init={}) {
  const r = await api(path, init);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${path}`);
  return r.json();
}

// tiny helper for in-page logging without devtools
export function debug(msg) {
  try {
    const box = document.getElementById("debug_box");
    if (box) box.textContent += (typeof msg==="string" ? msg : JSON.stringify(msg)) + "\n";
  } catch(_) {}
  console.log(msg);
}
