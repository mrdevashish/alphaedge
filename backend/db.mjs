import fs from "fs";
import path from "path";
import initSqlJs from "sql.js";

const DATA_DIR   = process.env.ALPHAEDGE_DATA_DIR || path.join(process.cwd(), ".data");
const DB_FILE    = path.join(DATA_DIR, "alphaedge.sqlite");

// Ensure data dir exists
fs.mkdirSync(DATA_DIR, { recursive: true });

let SQL;     // sql.js module
let db;      // live database instance

export async function openDB() {
  if (!SQL) SQL = await initSqlJs();
  if (db) return db;

  if (fs.existsSync(DB_FILE)) {
    const buf = fs.readFileSync(DB_FILE);
    db = new SQL.Database(new Uint8Array(buf));
  } else {
    db = new SQL.Database();
    bootstrap(db);
    persist();
  }
  return db;
}

function bootstrap(d) {
  d.run(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS subs (
      email TEXT PRIMARY KEY,
      active INTEGER NOT NULL DEFAULT 1,
      ts INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      ts INTEGER NOT NULL
    );
  `);
}

export function persist() {
  const data = db.export();
  const buf = Buffer.from(data);
  fs.writeFileSync(DB_FILE, buf);
}

// SUBSCRIPTIONS --------------------------------------------------------------

export function listSubs() {
  const stmt = db.prepare(`SELECT email, active, ts FROM subs ORDER BY ts DESC`);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows.map(r => ({
    email: r.email,
    active: !!r.active,
    ts: Number(r.ts)
  }));
}

export function upsertSub(email, active = true) {
  const ts = Date.now();
  const stmt = db.prepare(`
    INSERT INTO subs(email, active, ts) VALUES(?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET active=excluded.active, ts=excluded.ts
  `);
  stmt.run([email.trim().toLowerCase(), active ? 1 : 0, ts]);
  stmt.free();
  recordEvent("subs.upsert", { email, active, ts });
  persist();
  return { email, active, ts };
}

export function toggleSub(email) {
  email = email.trim().toLowerCase();
  const stmtSel = db.prepare(`SELECT active FROM subs WHERE email = ?`);
  let active = 1;
  stmtSel.bind([email]);
  if (stmtSel.step()) {
    const row = stmtSel.getAsObject();
    active = row.active ? 0 : 1;
  }
  stmtSel.free();
  upsertSub(email, !!active);
  return { email, active: !!active };
}

// EVENTS ---------------------------------------------------------------------

export function recordEvent(type, payload) {
  const stmt = db.prepare(`INSERT INTO events(type, payload, ts) VALUES (?, ?, ?)`);
  stmt.run([type, JSON.stringify(payload ?? {}), Date.now()]);
  stmt.free();
  persist();
}

export function listEvents(limit = 100) {
  const stmt = db.prepare(`
    SELECT id, type, payload, ts
    FROM events
    ORDER BY id DESC
    LIMIT ?
  `);
  const rows = [];
  stmt.bind([limit]);
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows.map(r => ({
    id: r.id,
    type: r.type,
    payload: JSON.parse(r.payload || "{}"),
    ts: Number(r.ts)
  }));
}
