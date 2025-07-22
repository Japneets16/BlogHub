const express = require("express");
const router = require("./routes/authrouter");
require("./models/db");
const path = require("path");

const app = express();

app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// route 
app.use("/user", router);

app.listen("3000",()=>{
    console.log("port is working");
});