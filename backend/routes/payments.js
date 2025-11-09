import { Router } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { run } from "../lib/db.js";

const router = Router();

function rpClient() {
  const key = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key || !secret) return null;
  return new Razorpay({ key_id: key, key_secret: secret });
}

// Create order (frontend would open Razorpay Checkout with this order_id)
router.post("/create-order", async (req, res) => {
  const rp = rpClient();
  if (!rp) return res.status(501).json({ error: "Razorpay not configured" });
  const { amount = 99900, currency = "INR", receipt = "alphaedge_" + Date.now() } = req.body || {};
  const order = await rp.orders.create({ amount, currency, receipt });
  res.json(order);
});

// Webhook verification (optional for now)
router.post("/webhook", async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return res.status(501).json({ error: "webhook secret not set" });
    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    const ok = crypto.timingSafeEqual(Buffer.from(signature || "", "utf8"), Buffer.from(expected, "utf8"));
    await run("INSERT INTO payment_events(kind,payload) VALUES (?,?)", ["webhook", body]);
    if (!ok) return res.status(400).json({ error: "bad signature" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
