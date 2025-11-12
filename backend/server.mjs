import express from "express";
import cors from "cors";
import crypto from "crypto";
import fetch from "node-fetch"; // Node 18+ has global fetch; keep for safety

// ----- ENV -----
const {
  PORT = 8080,
  FRONTEND_URL = "https://mrdevashish.github.io", // from your screenshot
  JWT_SECRET = "supersecret_change_me",
  RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "",
  ORG_NAME = "AlphaEdge",
  ORG_ADDRESS = "Mumbai, India",
  ORG_PIN = "MH",
  GSTIN = "XXABCDE1234F1Z5",
} = process.env;

// ----- APP -----
const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));

// ----- CORS -----
// Allow your frontend + local dev (helpful for testing from phone)
const allow = [FRONTEND_URL, "http://127.0.0.1:8081", "http://127.0.0.1:8080", "http://localhost:8081", "http://localhost:8080"];
app.use(cors({
  origin(origin, cb){
    if (!origin || allow.includes(origin)) return cb(null, true);
    return cb(null, true); // relax during dev; tighten later
  },
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type", "X-Signature"],
  maxAge: 86400,
}));

// ----- HEALTH -----
app.get("/health", (req,res)=>res.json({ ok:true }));

// ----- PUBLIC CONFIG (safe to show on frontend) -----
app.get("/config/public", (req,res)=>{
  res.json({
    ok:true,
    org: { name: ORG_NAME, address: ORG_ADDRESS, pin: ORG_PIN, gstin: GSTIN },
    frontendUrl: FRONTEND_URL,
    razorpayKeyId: RAZORPAY_KEY_ID ? "present" : "missing"
  });
});

// ----- SIMPLE AI ANALYZE (placeholder) -----
app.post("/api/ai/analyze", async (req,res)=>{
  try{
    const { symbol = "", tf = "1d" } = req.body || {};
    if (!symbol) return res.status(400).json({ ok:false, error:"symbol missing" });
    // TODO: replace with real logic
    return res.json({ ok:true, symbol, tf, momentum: (Math.random()*3).toFixed(2) });
  }catch(e){
    console.error("analyze error:", e);
    res.status(500).json({ ok:false, error:String(e) });
  }
});

// ----- SIMPLE SCREENER (placeholder) -----
app.post("/api/screener", async (req,res)=>{
  try{
    const { symbols = [], tf = "1d" } = req.body || {};
    const list = Array.isArray(symbols) ? symbols : String(symbols).split(",").map(s=>s.trim()).filter(Boolean);
    const results = list.map(s => ({ symbol:s, momentum:(Math.random()*3).toFixed(2), vsSMA20:"-" }));
    res.json({ ok:true, results });
  }catch(e){
    console.error("screener error:", e);
    res.status(500).json({ ok:false, error:String(e) });
  }
});

// ----- RAZORPAY (order create) -----
app.post("/api/razorpay/order", async (req,res)=>{
  try{
    const { amount, currency="INR", receipt="rcpt_"+Date.now() } = req.body || {};
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return res.status(500).json({ ok:false, error:"Razorpay keys missing" });
    const r = await fetch("https://api.razorpay.com/v1/orders", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Basic "+Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")
      },
      body: JSON.stringify({ amount, currency, receipt })
    });
    const j = await r.json();
    if (!r.ok) return res.status(400).json({ ok:false, error:j });
    res.json({ ok:true, order:j });
  }catch(e){
    console.error("razorpay order error:", e);
    res.status(500).json({ ok:false, error:String(e) });
  }
});

// ----- RAZORPAY WEBHOOK VERIFY (optional) -----
app.post("/webhooks/razorpay", express.raw({type:"application/json"}), (req,res)=>{
  try{
    const signature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    if (!webhookSecret) return res.status(200).send("no secret set");
    const expected = crypto.createHmac("sha256", webhookSecret).update(req.body).digest("hex");
    if (signature !== expected) return res.status(400).send("bad signature");
    // TODO: process event
    res.status(200).send("ok");
  }catch(e){
    console.error("webhook error:", e);
    res.status(200).send("ok");
  }
});

// ----- LISTEN -----
app.listen(PORT, "0.0.0.0", ()=> {
  console.log(`✅ Backend listening on 0.0.0.0:${PORT}`);
});

// Health check
app.get('/health',(req,res)=>res.json({ok:true,uptime:process.uptime()}));
