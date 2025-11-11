import fs from "fs"; import path from "path";
const DATA_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), "data");
const FILE = path.join(DATA_DIR, "events.json");
function ensure(){ if(!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR,{recursive:true}); if(!fs.existsSync(FILE)) fs.writeFileSync(FILE,"[]"); }
export function listEvents(){ ensure(); try{ return JSON.parse(fs.readFileSync(FILE,"utf8")); }catch{ return []; } }
export function addEvent(e){ ensure(); const arr=listEvents(); const rec={ id:Date.now().toString(36), ts:Date.now(), ...e }; arr.push(rec); fs.writeFileSync(FILE,JSON.stringify(arr,null,2)); return rec; }
