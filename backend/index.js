const express = require("express");
const router = require("../backend/routes/authrouter");
require("../backend/models/db");


const app = express();

app.use(express.json());


// route 
app.use ("/user",router);




app.listen("3000",()=>{
    console.log("port is working");
})
