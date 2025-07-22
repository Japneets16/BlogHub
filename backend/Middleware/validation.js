const jwt = require("jsonwebtoken");
const Usermodel = require("../models/user");

const secretKey = "jpsingh";

// Auth middleware: verifies JWT and attaches user info
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, secretKey);
    // Attach full user object for role checks
    req.user = await Usermodel.findById(user.id);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", err: err.message });
  }
};

// Role-based access middleware
const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: insufficient permissions" });
  }
  next();
};

module.exports = { authMiddleware, requireRole };