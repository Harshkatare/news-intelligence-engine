const express = require("express");
const router = express.Router();
const News = require("../models/News");

// GET /api/read/news?symbol=AAPL&page=1&limit=10
router.get("/news", async (req, res) => {
  const { symbol, page = 1, limit = 10 } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "symbol is required" });
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    News.find({ stockSymbol: symbol.toUpperCase() })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select({
        optimizedContent: 0, // exclude heavy field
      }),
    News.countDocuments({ stockSymbol: symbol.toUpperCase() }),
  ]);

  res.json({
    symbol: symbol.toUpperCase(),
    page: Number(page),
    limit: Number(limit),
    total,
    items,
  });
});

// GET /api/read/news/:id
router.get("/news/:id", async (req, res) => {
  const article = await News.findById(req.params.id);

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  res.json(article);
});

module.exports = router;
