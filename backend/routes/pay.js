import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import db from '../lib/db.js';

const router = express.Router();
const key_id     = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;
const wh_secret  = process.env.RAZORPAY_WEBHOOK_SECRET || key_secret; // fallback if not set

const rz = new Razorpay({ key_id, key_secret });

// Create order (body: {plan:"monthly"|"quarterly"|"yearly"})
router.post('/checkout', express.json(), async (req, res) => {
  try {
    const plan = req.body?.plan || 'monthly';
    const amount = plan === 'yearly' ? 69900 * 10 : plan === 'quarterly' ? 69900 * 3 : 69900; // in paise
    const order = await rz.orders.create({ amount, currency: 'INR', receipt: 'rcpt_' + Date.now() });
    db.orders.upsert({ id: order.id, rz_order_id: order.id, plan, status: 'created' });
    res.json({ order, key_id });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Webhook must use RAW body
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const payload = req.body; // Buffer
      const digest = crypto.createHmac('sha256', wh_secret).update(payload).digest('hex');
      if (signature !== digest) return res.status(400).json({ message: 'bad signature' });

      const body = JSON.parse(payload.toString('utf8'));
      db.events.push({ type: body.event, payload: body });

      if (body.event === 'payment.captured') {
        const pay = body.payload?.payment?.entity;
        const rz_order_id = pay?.order_id;
        const email = pay?.email || pay?.notes?.email;
        const ord = db.orders.byRz(rz_order_id);
        if (email && ord) {
          const days = ord.plan === 'yearly' ? 365 : ord.plan === 'quarterly' ? 90 : 30;
          const expiresAt = new Date(Date.now() + days * 86400000);
          db.subs.upsert({ email, plan: ord.plan, expiresAt, status: 'active' });
        }
      }
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ message: e.message }); }
  }
);

export default router;
