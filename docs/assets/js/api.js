export const API_BASE = window.API_BASE_OVERRIDE || "";
export async function api(path, opts={}) {
  const u = API_BASE + path;
  const r = await fetch(u, opts);
  if (!r.ok) throw new Error(`API ${r.status} ${u}`);
  return r.json();
}
