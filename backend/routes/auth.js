import { Router } from "express";
import { db, get, run } from "../lib/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

function signToken(user) {
  const payload = { id: user.id, email: user.email, name: user.name };
  return jwt.sign(payload, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  try {
    const { name = "", email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email & password required" });

    const exists = await get("SELECT id FROM users WHERE email = ?", [email]);
    if (exists) return res.status(409).json({ error: "email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const { id } = await run("INSERT INTO users(name,email,hash) VALUES (?,?,?)", [name, email, hash]);
    const token = signToken({ id, email, name });
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return res.status(401).json({ error: "invalid credentials" });
    const ok = await bcrypt.compare(password, user.hash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const token = signToken(user);
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
