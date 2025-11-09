import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { getDB } from "../lib/db.js";

const router = express.Router();

const key_id = process.env.RAZORPAY_KEY_ID || "";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "";
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

const rzp = (key_id && key_secret) ? new Razorpay({ key_id, key_secret }) : null;

// Create order for a plan (amounts are paise)
router.post("/create-order", async (req,res)=>{
  try{
    if(!rzp) return res.status(500).json({error:"Razorpay keys not set"});
    const { plan="monthly", email="" } = req.body || {};
    const PLAN_AMOUNTS = { weekly: 29900, monthly: 99900, yearly: 999900 }; // ₹ in paise
    const amount = PLAN_AMOUNTS[plan] ?? PLAN_AMOUNTS.monthly;

    const order = await rzp.orders.create({
      amount, currency: "INR",
      notes: { plan, email }
    });
    return res.json({
      key: key_id,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  }catch(e){
    console.error("Create order error", e);
    res.status(500).json({error:"order_failed"});
  }
});

// Razorpay webhook
router.post("/webhook", express.raw({ type: "application/json" }), async (req,res)=>{
  try{
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body; // Buffer (because express.raw)
    const expected = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex");
    if(signature !== expected) return res.status(400).json({error:"bad_signature"});

    const event = JSON.parse(body.toString());

    if(event.event === "payment.captured"){
      const payment = event.payload.payment.entity;
      const notes = payment.notes || {};
      const plan = notes.plan || "monthly";
      const email = (notes.email || "").toLowerCase();

      const db = await getDB();
      // Ensure user exists
      let user = await db.get("SELECT * FROM users WHERE email=?", [email]);
      if(!user){
        await db.run("INSERT INTO users(name,email,password_hash,verified) VALUES (?,?,?,1)", ["", email, "", 1]);
        user = await db.get("SELECT * FROM users WHERE email=?", [email]);
      }
      // Activate subscription for 30/7/365 days depending on plan
      const daysMap = { weekly: 7, monthly: 30, yearly: 365 };
      const days = daysMap[plan] || 30;
      const start = new Date();
      const end = new Date(Date.now()+days*24*3600*1000);

      await db.run(
        "INSERT INTO subscriptions(user_id,plan,status,start_at,end_at,razorpay_payment_id) VALUES (?,?,?,?,?,?)",
        [user.id, plan, "active", start.toISOString(), end.toISOString(), payment.id]
      );

      await db.run("INSERT INTO audit(type,payload) VALUES (?,?)", ["payment_webhook", JSON.stringify(event)]);
    }

    return res.json({received:true});
  }catch(e){
    console.error("Webhook error", e);
    res.status(500).json({error:"webhook_error"});
  }
});

export default router;
