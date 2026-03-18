require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const RawNews = require("../models/RawNews");
const { resolveArticleInput } = require("../services/contentResolver.service");

(async () => {
  await connectDB();

  const article = await RawNews.findOne({ stockSymbol: "AAPL" });

  const result = await resolveArticleInput(article);

  console.log("TYPE:", result.type);
  console.log("CONTENT PREVIEW:\n");
  console.log(result.content.slice(0, 500));

  await mongoose.connection.close();
})();
