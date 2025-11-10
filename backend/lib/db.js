import sqlite3 from "sqlite3";
import { open } from "sqlite";
sqlite3.verbose();

export async function getDB() {
  const db = await open({ filename: "./alphaedge.db", driver: sqlite3.Database });
  await db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password_hash TEXT,
      verified INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      plan TEXT,
      status TEXT,           -- trial|active|paused|cancelled|expired
      start_at TEXT,
      end_at TEXT,
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,             -- payment_webhook|login|admin_action
      payload TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  return db;
}
