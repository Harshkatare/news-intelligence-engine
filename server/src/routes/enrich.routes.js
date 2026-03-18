const express = require("express");
const router = express.Router();
const { runEnrichmentForSymbol } = require("../services/enrichment.service");

router.post("/run", async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ error: "symbol required" });

  await runEnrichmentForSymbol(symbol.toUpperCase());
  res.json({ status: "ok" });
});

module.exports = router;
