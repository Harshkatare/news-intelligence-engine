require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Stock = require("../models/Stock");
const RawNews = require("../models/RawNews");
const News = require("../models/News");

(async () => {
  await connectDB();

   const stock = await Stock.create({
    symbol: "AAPL",
    name: "Apple Inc."
  });

  const raw = await RawNews.create({
    stockSymbol: "AAPL",
    title: "Apple shares rise after earnings",
    url: "https://example.com/apple-news",
    source: "Example News",
  });

  const news = await News.create({
    stockSymbol: "AAPL",
    originalTitle: raw.title,
    optimizedTitle: "Apple Stock Surges After Strong Earnings Report",
    originalUrl: raw.url,
    shortDescription:
      "Apple shares moved higher after the company reported better-than-expected quarterly earnings.",
    optimizedContent:
      "Apple Inc. reported quarterly earnings that exceeded market expectations...",
    source: raw.source,
  });

  console.log("Stock:", stock.symbol);
  console.log("RawNews:", raw.title);
  console.log("News:", news.optimizedTitle);

  await mongoose.connection.close();
})();
