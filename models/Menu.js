const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);
