import { sendMail } from "../lib/mailer.js";
import express from 'express'; import crypto from 'crypto'; import Razorpay from 'razorpay';
import db from '../lib/db.js';
const router=express.Router();
const key_id=process.env.RAZORPAY_KEY_ID, key_secret=process.env.RAZORPAY_KEY_SECRET;
const rz = new Razorpay({key_id, key_secret});

// Create order (amount paise). body: {plan:"monthly"}
router.post('/checkout', async (req,res)=>{
  try{
    const plan=req.body?.plan||'monthly';
    const amount = plan==='yearly'? 69900*10 : plan==='quarterly'? 69900*3 : 69900; // ₹699 demo
    const order = await rz.orders.create({amount, currency:'INR', receipt:'rcpt_'+Date.now()});
    db.orders.upsert({id:order.id, rz_order_id:order.id, plan, status:'created'});
    res.json({order, key_id});
  }catch(e){ res.status(500).json({message:e.message}); }
});

// Webhook (set secret in Razorpay > Settings > Webhooks)
router.post('/webhook', express.json({type:'application/json'}), (req,res)=>{
  try{
    const sig=req.headers['x-razorpay-signature']; const body=JSON.stringify(req.body);
    const calc=crypto.createHmac('sha256', key_secret).update(body).digest('hex');
    if(sig!==calc) return res.status(400).json({message:'bad signature'});
    db.events.push({type:req.body.event,payload:req.body});
    if(req.body.event==='payment.captured'){
      const rz_order_id = req.body.payload?.payment?.entity?.order_id;
      const email = req.body.payload?.payment?.entity?.email || req.body.payload?.payment?.entity?.notes?.email;
      const ord = db.orders.byRz(rz_order_id); if(email && ord){
        const days = ord.plan==='yearly'?365: ord.plan==='quarterly'?90:30;
        const expiresAt = new Date(Date.now()+days*86400000);
        db.subs.upsert({email,plan:ord.plan,expiresAt,status:'active'}); await sendMail(email,"Payment received","<p>Your "+ord.plan+" plan is active till "+expiresAt.toDateString()+"</p>");
      }
    }
    return res.json({ok:true});
  }catch(e){ return res.status(500).json({message:e.message}); }
});
export default router;
