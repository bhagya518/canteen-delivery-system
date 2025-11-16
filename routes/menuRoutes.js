const express = require("express");
const Menu = require("../models/Menu");
const router = express.Router();

// GET /api/menu - list all menu items
router.get("/", async (req, res) => {
  try {
    const items = await Menu.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch menu" });
  }
});

// POST /api/menu - create a new item
router.post("/", async (req, res) => {
  try {
    const item = new Menu(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message || "Invalid menu item" });
  }
});

// POST /api/menu/seed - seed curated items; use ?force=1 to reseed (delete existing first)
router.post("/seed", async (req, res) => {
  try {
    const force = req.query.force === "1" || req.query.force === "true";
    const count = await Menu.countDocuments();

    if (count > 0 && !force) {
      return res.json({ message: "Menu already seeded", count, hint: "Add ?force=1 to reseed" });
    }

    if (force && count > 0) {
      await Menu.deleteMany({});
    }

    const sample = [
      {
        name: "Margherita Pizza",
        price: 199,
        category: "pizza",
        isPopular: true,
        image: "https://images.unsplash.com/photo-1548365328-8b30aa96f2ee?q=80&w=1200&auto=format&fit=crop",
        description: "Classic tomato, mozzarella, and basil."
      },
      {
        name: "Pepperoni Pizza",
        price: 249,
        category: "pizza",
        image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=1200&auto=format&fit=crop",
        description: "Loaded with spicy pepperoni and cheese."
      },
      {
        name: "Veggie Burger",
        price: 149,
        category: "burger",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
        description: "Grilled veggie patty with fresh lettuce and tomato."
      },
      {
        name: "Chicken Burger",
        price: 179,
        category: "burger",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1200&auto=format&fit=crop",
        description: "Crispy chicken fillet with mayo and pickles."
      },
      {
        name: "Pasta Alfredo",
        price: 189,
        category: "pasta",
        image: "https://images.unsplash.com/photo-1526312426976-593c2d0d3d50?q=80&w=1200&auto=format&fit=crop",
        description: "Creamy garlic parmesan sauce with penne."
      },
      {
        name: "Pasta Arrabbiata",
        price: 179,
        category: "pasta",
        image: "https://images.unsplash.com/photo-1603072386435-75b68cd1a921?q=80&w=1200&auto=format&fit=crop",
        description: "Spicy tomato sauce with herbs."
      },
      {
        name: "French Fries",
        price: 99,
        category: "sides",
        image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?q=80&w=1200&auto=format&fit=crop",
        description: "Golden, crispy, lightly salted."
      },
      {
        name: "Chicken Wings",
        price: 219,
        category: "sides",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
        description: "Spicy buffalo wings with dip."
      },
      {
        name: "Chocolate Brownie",
        price: 89,
        category: "dessert",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476b?q=80&w=1200&auto=format&fit=crop",
        description: "Warm, fudgy brownie."
      },
      {
        name: "Gulab Jamun",
        price: 79,
        category: "dessert",
        image: "https://images.unsplash.com/photo-1625940957897-8a264b1c65b4?q=80&w=1200&auto=format&fit=crop",
        description: "Soft milk dumplings soaked in sugar syrup."
      }
    ];

    const created = await Menu.insertMany(sample);
    res.status(201).json({ message: force ? "Reseeded" : "Seeded", count: created.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to seed menu" });
  }
});

module.exports = router;
