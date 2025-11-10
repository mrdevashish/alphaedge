import express from 'express';
import db from '../lib/db.js';
import { sendMail } from '../lib/mailer.js';
const router = express.Router();

router.post('/send-verify', express.json(), async (req,res)=>{
  const email=(req.body?.email||'').trim().toLowerCase(); if(!email) return res.status(400).json({message:'email required'});
  const code = Math.floor(100000+Math.random()*900000).toString();
  db.events.push({ type:'email_verify_code', email, code });
  await sendMail(email,'Verify your email',`<p>Your code is <b>${code}</b></p>`);
  res.json({ ok:true });
});

router.post('/verify', express.json(), async (req,res)=>{
  const email=(req.body?.email||'').trim().toLowerCase(); const code=req.body?.code?.trim();
  if(!email||!code) return res.status(400).json({message:'email/code required'});
  const items = db.events.list().filter(e=>e.type==='email_verify_code' && e.email===email).slice(-5);
  const ok = items.some(e=>e.code===code);
  if(!ok) return res.status(400).json({message:'invalid code'});
  // mark user as verified
  const u = db.users.find(email) || { email };
  db.users.upsert({ ...u, verified:true });
  res.json({ ok:true, verified:true });
});

export default router;
