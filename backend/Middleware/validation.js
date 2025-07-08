const jwt = require("jsonwebtoken");
// const Usermodel = require("../models/user");

// Secret key (should go in .env for real projects)*
const secretKey = "jpsingh";

// Middleware to check if user is logged in*
const authMiddleware = (req, res, next) => {
  // Get the token from request headers*
  const authHeader = req.headers.authorization;

  // If token is missing or malformed*
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  // Remove "Bearer " and get the actual token*
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret key*
    const user = jwt.verify(token, secretKey);
    // Add user data to req.user so we can access it in routes*
    req.user = user;
    // Move to the next middleware or route*
    next();
  } catch (err) {
    return res.status(401).json
    ({ message: "Invalid token",
      err:err.message,

    });
  }
};

// Do not remove this — export it as a named object for destructuring in routes*
module.exports = { authMiddleware };
