import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getDB } from "../lib/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

function hash(pw){ return crypto.createHash("sha256").update(pw).digest("hex"); }

router.post("/register", async (req,res)=>{
  const { name, email, password } = req.body || {};
  if(!email || !password) return res.status(400).json({error:"email & password required"});
  const db = await getDB();
  try{
    await db.run("INSERT INTO users(name,email,password_hash,verified) VALUES (?,?,?,1)", [name||"", email.toLowerCase(), hash(password)]);
  }catch(e){ return res.status(409).json({error:"email exists"}); }
  return res.json({ ok:true });
});

router.post("/login", async (req,res)=>{
  const { email, password } = req.body || {};
  const db = await getDB();
  const user = await db.get("SELECT * FROM users WHERE email=?", [String(email||"").toLowerCase()]);
  if(!user || user.password_hash!==hash(password)) return res.status(401).json({error:"invalid creds"});
  const token = jwt.sign({ uid:user.id, email:user.email }, JWT_SECRET, { expiresIn:"7d" });
  res.json({ token, user:{ id:user.id, name:user.name, email:user.email } });
});

export default router;
