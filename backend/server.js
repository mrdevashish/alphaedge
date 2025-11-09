import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import subRoutes from "./routes/subscriptions.js";
import paymentsRoutes from "./routes/payments.js";

dotenv.config();
const app = express();

app.use(express.json());

const ALLOWED = (process.env.FRONTEND_ORIGIN || "")
  .split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED.some(a => origin === a || (a.endsWith("*") && origin.startsWith(a.slice(0, -1))))) return cb(null, true);
    return cb(new Error("CORS: origin not allowed"));
  },
  credentials: true
}));

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/", (req, res) => res.send("AlphaEdge backend is running"));
app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subRoutes);
app.use("/api/payments", paymentsRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
