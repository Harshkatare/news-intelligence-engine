const mongoose = require("mongoose");
const { type } = require("os");

const RawNewsSchema = new mongoose.Schema(
  {
    stockSymbol: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
    },
    source: {
      type: String,
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RawNews", RawNewsSchema);
