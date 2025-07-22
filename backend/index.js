const express = require("express");
const router = require("./routes/authrouter");
require("dotenv").config(); //load environment variables*

const app = express();

// middleware*
app.use(express.json());

// connect to database*
require("./models/db");

// routes*
app.use("/user", router);

// basic route*
app.get("/", (req, res) => {
    res.json({
        message: "Blogging API is running!",
        features: [
            "🔍 Advanced Search & Filtering",
            "👤 User Profiles & Follow System", 
            "📧 Email Integration",
            "📱 File Upload System",
            "📊 Analytics & Metrics",
            "📂 Category Management",
            "🔖 Bookmarks/Favorites"
        ]
    });
});

// start server*
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
