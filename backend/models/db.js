const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://jpsingh:jpsingh3205@cluster1.lcrcel4.mongodb.net/")

.then(()=>{ 

console.log("conneted to the db");

}).catch((err)=>{

console.log("no connection",err);

})