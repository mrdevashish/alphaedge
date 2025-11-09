import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import subRoutes from "./routes/subscriptions.js";
import payRoutes from "./routes/payments.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "1mb" }));

// CORS — allow your GitHub Pages site (and localhost for quick tests)
const allow = (process.env.FRONTEND_ORIGIN || "").split(",").map(s=>s.trim()).filter(Boolean);
app.use(cors({
  origin(origin, cb){
    if (!origin) return cb(null, true);
    if (allow.some(a => origin === a || (a.endsWith("*") && origin.startsWith(a.slice(0,-1))))) return cb(null,true);
    return cb(null, true); // be permissive for now
  },
  credentials:true
}));

app.get("/health", (_req, res) => res.json({ ok:true }));

// mount APIs
app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subRoutes);
app.use("/api/payments", payRoutes);

// root
app.get("/", (_req, res) => res.send("AlphaEdge backend running"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
