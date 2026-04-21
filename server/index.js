require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const stripe   = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connectDB = require("./db");

const app = express();

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"] }));
app.use(express.json());

// ── Serve uploaded images ─────────────────────────────────────────
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Connect MongoDB ───────────────────────────────────────────────
connectDB();

// ── API Routes ────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/upload",   require("./routes/upload"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders",   require("./routes/orders"));
app.use("/api/reviews",  require("./routes/reviews"));
app.use("/api/home-settings", require("./routes/homeSettings"));

// ── Stripe: create payment intent ────────────────────────────────
// body: { amount: number }  amount is in paise (₹1 = 100 paise)
app.post("/api/payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < 50) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    const intent = await stripe.paymentIntents.create({
      amount:   Math.round(amount),
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Health check ──────────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// ── Start server ──────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n✦ Jordan Backend → http://localhost:${PORT}`);
  console.log(`  POST /api/payment-intent`);
  console.log(`  GET  /api/products`);
  console.log(`  POST /api/products`);
  console.log(`  PUT  /api/products/:id`);
  console.log(`  DEL  /api/products/:id`);
  console.log(`  GET  /api/orders`);
  console.log(`  POST /api/orders`);
  console.log(`  PATCH /api/orders/:id/status\n`);
});
