import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: (origin, cb) => cb(null, true),
  credentials: true
}));

app.get("/health", (req, res) => res.json({ ok: true }));

// Placeholder routes
app.get("/", (req, res) => res.send("AlphaEdge backend is running"));
app.post("/api/payments/create-order", (req, res) => {
  res.json({ message: "Razorpay order creation endpoint will go here" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
