const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Ready", "Delivered"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
