const { kStringMaxLength } = require("buffer");
const mongoose = require("mongoose");
const { type } = require("os");
const { stringify } = require("querystring");

const NewsSchema = new mongoose.Schema(
  {
    stockSymbol: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },

    originalTitle: {
      type: String,
      required: true,
    },

    optimizedTitle: {
      type: String,
      required: true,
    },

    originalUrl: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    optimizedContent: {
      type: String,
      required: true,
    },

    source: {
      type: String,
    },

    publishedAt: {
      type: Date,
    },

    aiModel: {
      type: String,
      default: "gemini",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("News", NewsSchema);
