const express = require("express");
const router = require("./routes/authrouter");
require("./models/db"); // this will now safely load your MongoDB connection from .env
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ✅ Update CORS to include your deployed frontend URL
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://blog-hub-nu.vercel.app/" // ⚠️ Replace with your actual Vercel frontend URL after deployment
  ],
  credentials: true
}));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Default route
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/user", router);

// ✅ IMPORTANT: use process.env.PORT (Render assigns a random port)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
