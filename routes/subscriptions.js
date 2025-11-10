import express from "express";
import jwt from "jsonwebtoken";
import { getDB } from "../lib/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

function auth(req,res,next){
  const h=req.headers.authorization||""; 
  const token=h.startsWith("Bearer ")?h.slice(7):null;
  if(!token) return res.status(401).json({error:"missing token"});
  try{ req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch{ return res.status(401).json({error:"invalid token"}); }
}

router.get("/me", auth, async (req,res)=>{
  const db = await getDB();
  const s = await db.get("SELECT * FROM subscriptions WHERE user_id=? AND status IN('trial','active') ORDER BY id DESC LIMIT 1", [req.user.uid]);
  res.json({ subscription: s || null });
});

router.post("/activate", auth, async (req,res)=>{
  const { plan="monthly", days=30 } = req.body || {};
  const db = await getDB();
  const start = new Date();
  const end = new Date(Date.now()+days*24*3600*1000);
  await db.run(
    "INSERT INTO subscriptions(user_id,plan,status,start_at,end_at) VALUES (?,?,?,?,?)",
    [req.user.uid, plan, "active", start.toISOString(), end.toISOString()]
  );
  res.json({ ok:true });
});

export default router;
