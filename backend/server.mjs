import express from "express";
import cors from "cors";

const app = express();

// ---------- CORS ----------
const allowList = new Set(
  (process.env.FRONTEND_URL || "https://mrdevashish.github.io")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowList.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

// ---------- health ----------
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    port: process.env.PORT || 8080,
    allowList: [...allowList],
  });
});

// ---------- API: screener (demo calc) ----------
app.post("/api/screener", async (req, res) => {
  try {
    const { symbols = [], tf = "1d" } = req.body || {};
    const results = symbols.map((s, i) => ({
      symbol: s,
      tf,
      momentum: +(1 + (i + 1) * 0.37).toFixed(2),
      vsSMA20: +(3 + (i + 1) * 0.21).toFixed(2),
    }));
    res.json({ ok: true, results });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e) });
  }
});

// ---------- API: ai/analyze (demo) ----------
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { symbol = "RELIANCE.NS", tf = "1d" } = req.body || {};
    res.json({
      ok: true,
      symbol,
      tf,
      summary:
        "Demo analysis: trend mildly bullish; watch pullbacks near 20-EMA; risk tight under last swing low.",
    });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e) });
  }
});

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).json({ ok: false, error: `Not found: ${req.method} ${req.path}` });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {

// --- static site serving added by script ---
import path from "path";
app.use(express.static(path.join(process.cwd(), "public")));
app.get("/", (req,res)=> res.sendFile(path.join(process.cwd(), "public/index.html")));

// --- static site serving added by script ---
import path from "path";
app.use(express.static(path.join(process.cwd(), "public")));
app.get("/", (req,res)=> res.sendFile(path.join(process.cwd(), "public/index.html")));

// --- static site serving added by script ---
import path from "path";
app.use(express.static(path.join(process.cwd(), "public")));
app.get("/", (req,res)=> res.sendFile(path.join(process.cwd(), "public/index.html")));

// --- static site serving added by script ---
import path from "path";
app.use(express.static(path.join(process.cwd(), "public")));
app.get("/", (req,res)=> res.sendFile(path.join(process.cwd(), "public/index.html")));

// --- static site serving added by script ---
import path from "path";
app.use(express.static(path.join(process.cwd(), "public")));
app.get("/", (req,res)=> res.sendFile(path.join(process.cwd(), "public/index.html")));
  console.log(`AlphaEdge backend listening on ${PORT}`);
});
