const router = require("express").Router();
const Order = require("../models/Order");

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { items, total, delivery, paymentIntentId, paymentMethod, userId } = req.body;
    if (!items?.length || !total || !delivery) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // COD orders don't have a paymentIntentId
    if (paymentMethod === "online" && !paymentIntentId) {
      return res.status(400).json({ error: "paymentIntentId required for online payment" });
    }
    const order = await Order.create({
      items, total, delivery,
      paymentIntentId: paymentIntentId || "COD",
      paymentMethod:   paymentMethod || "online",
      userId:          userId || null,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/orders/my/:userId
router.get("/my/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/orders/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/orders/:id/return  — customer requests a return
router.post("/:id/return", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.status !== "delivered") {
      return res.status(400).json({ error: "Only delivered orders can be returned" });
    }

    // 7-day return window from when order was last updated (delivery)
    const deliveredAt = new Date(order.updatedAt);
    const windowEnd   = new Date(deliveredAt);
    windowEnd.setDate(windowEnd.getDate() + 7);
    if (new Date() > windowEnd) {
      return res.status(400).json({ error: "Return window of 7 days has expired" });
    }

    if (order.returnRequest && order.returnRequest.requestedAt) {
      return res.status(400).json({ error: "Return already requested for this order" });
    }

    order.status = "return_requested";
    order.returnRequest = {
      requestedAt: new Date(),
      reason:      req.body.reason || "",
      approved:    null,
    };
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/orders/:id/return/review  — admin approves or rejects return
router.patch("/:id/return/review", async (req, res) => {
  try {
    const { approved } = req.body;
    if (typeof approved !== "boolean") {
      return res.status(400).json({ error: "approved must be true or false" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.status !== "return_requested") {
      return res.status(400).json({ error: "No pending return request on this order" });
    }

    order.returnRequest.approved = approved;
    order.status = approved ? "returned" : "delivered";
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
