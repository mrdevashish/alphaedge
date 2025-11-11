import fs from "fs";
const FILE = new URL("./data/subscriptions.json", import.meta.url);

function ensureFile(){
  const f = FILE.pathname;
  if (!fs.existsSync(fs.dirname ? fs.dirname(f) : "./backend/data")) {
    fs.mkdirSync("./backend/data", { recursive: true });
  }
  if (!fs.existsSync(f)) fs.writeFileSync(f, "[]");
}

export function listSubs(){
  ensureFile();
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); }
  catch { return []; }
}

export function addSub(rec){
  ensureFile();
  const arr = listSubs();
  arr.push({ id: Date.now().toString(36), ...rec });
  fs.writeFileSync(FILE, JSON.stringify(arr,null,2));
  return rec;
}
