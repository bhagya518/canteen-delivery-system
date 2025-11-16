const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

// POST /api/orders - create new order
router.post("/", async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;
    if (!userId || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: "Invalid order payload" });
    }

    const order = new Order({ userId, items, totalAmount });
    await order.save();
    res.status(201).json({ message: "Order placed", order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// GET /api/orders/:userId - list orders for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;
