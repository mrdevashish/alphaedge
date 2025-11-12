import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbFile = path.join(__dirname, 'cache.json')

let db = { candles: {}, cache: {} }

if (fs.existsSync(dbFile)) {
  try {
    db = JSON.parse(fs.readFileSync(dbFile, 'utf-8'))
  } catch (e) {
    console.error('DB load error:', e.message)
  }
}

function save() {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2))
}

export function cacheGet(key, ttl) {
  const now = Date.now()
  const item = db.cache[key]
  if (item && now - item.time < ttl) return item.value
  return null
}

export function cacheSet(key, value) {
  db.cache[key] = { time: Date.now(), value }
  save()
}

export function putCandles(symbol, tf, rows) {
  db.candles[`${symbol}:${tf}`] = rows
  save()
}

export function getCandles(symbol, tf) {
  return db.candles[`${symbol}:${tf}`] || []
}

export { db }
