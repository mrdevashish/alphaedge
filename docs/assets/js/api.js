/* api.js — minimal fetch helper with optional host override */
const API_BASE = (typeof window !== "undefined" && window.API_BASE_OVERRIDE)
  ? window.API_BASE_OVERRIDE
  : "http://127.0.0.1:5000";

export async function api(path, opts={}) {
  const r = await fetch(`${API_BASE}${path}`, {
    headers: { "content-type": "application/json", ...(opts.headers||{}) },
    ...opts
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r;
}

export async function apiJSON(path, opts={}) {
  const r = await api(path, opts);
  return r.json();
}
