import express from 'express';
import { requireAuth } from '../lib/requireAuth.js'; // if you have a JWT middleware. fallback inline below.
import db from '../lib/db.js'; // adapt to your user/subscription storage

const router = express.Router();
const ADMIN = (process.env.ADMIN_EMAIL||'').toLowerCase();

// simple guard if no middleware exists
function requireAdmin(req,res,next){
  try{
    const email = (req.user?.email || req.adminEmail || '').toLowerCase();
    if(!email) return res.status(401).json({message:'unauthenticated'});
    if(email!==ADMIN) return res.status(403).json({message:'forbidden'});
    next();
  }catch(e){ res.status(401).json({message:'unauthenticated'}); }
}

// Example: if your auth middleware sets req.user
const guard = [/*requireAuth ||*/ (req,_res,next)=>next(), requireAdmin];

router.get('/users', guard, async (_req,res)=>{
  const users = await db.users.list(); // implement list() in lib/db.js
  res.json(users.map(u=>({email:u.email,name:u.name||''})));
});

router.get('/subscriptions', guard, async (_req,res)=>{
  const subs = await db.subs.list(); // implement list() in lib/db.js
  res.json(subs);
});

router.post('/activate', guard, async (req,res)=>{
  const { email, plan='monthly', days=30 } = req.body||{};
  if(!email) return res.status(400).json({message:'email required'});
  const now = new Date();
  const expiresAt = new Date(now.getTime()+days*86400000);
  const sub = await db.subs.upsert({ email, plan, expiresAt });
  res.json(sub);
});

export default router;
