const express = require("express");
const router = require("./routes/authrouter");
require("./models/db");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// route
app.use("/user", router);

app.listen("5000",()=>{
    console.log("port is working");
});
