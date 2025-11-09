import { Router } from "express";
import jwt from "jsonwebtoken";
import { get, run } from "../lib/db.js";

const router = Router();

function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "missing token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    next();
  } catch {
    res.status(401).json({ error: "invalid token" });
  }
}

router.get("/me", auth, async (req, res) => {
  const sub = await get(
    "SELECT plan, active_until, status FROM subscriptions WHERE user_id=? AND status='active' ORDER BY active_until DESC LIMIT 1",
    [req.user.id]
  );
  if (!sub) return res.json({ subscription: null });
  const active = new Date(sub.active_until) > new Date();
  res.json({ subscription: active ? sub : null });
});

// Simulated activation until Razorpay is live
router.post("/activate", auth, async (req, res) => {
  const { plan = "monthly", days = 30 } = req.body || {};
  const until = new Date(Date.now() + days * 86400_000).toISOString();
  await run("INSERT INTO subscriptions(user_id, plan, active_until, status) VALUES (?,?,?,?)",
    [req.user.id, plan, until, "active"]);
  res.json({ ok: true, plan, active_until: until });
});

export default router;
