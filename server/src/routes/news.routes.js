const express = require("express");
const router = express.Router();

const RawNews = require("../models/RawNews");
const Stock = require("../models/Stock");
const { fetchTopNews } = require("../services/seekingAlpha.service");

router.get("/search", async (req, res) => {
  try {
    const symbol = req.query.symbol?.toUpperCase();

    if (!symbol) {
      return res.status(400).json({ error: "Stock symbol required" });
    }

    // ensure stock exists
    await Stock.findOneAndUpdate(
      { symbol },
      { symbol, lastFetchedAt: new Date() },
      { upsert: true },
    );

    const articles = await fetchTopNews(symbol);

    const inserted = [];

    for (const article of articles) {
      const exists = await RawNews.findOne({ url: article.url });
      if (exists) continue;

      const raw = await RawNews.create({
        stockSymbol: symbol,
        title: article.title,
        url: article.url,
        source: article.source,
        publishedAt: new Date(),
        isPremium: article.isPremium,
      });

      inserted.push(raw);
    }

    res.json({
      symbol,
      fetched: articles.length,
      inserted: inserted.length,
      articles,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

module.exports = router;