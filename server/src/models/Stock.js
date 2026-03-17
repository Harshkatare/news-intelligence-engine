const mongoose = require("mongoose");
const { type } = require("os");

const StockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
    },
    lastFetchedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Stock", StockSchema);
