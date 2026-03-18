require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

const newsRoutes = require("./routes/news.routes");
app.use("/api/news", newsRoutes);

const enrichRoutes = require("./routes/enrich.routes");
app.use("/api/enrich", enrichRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
