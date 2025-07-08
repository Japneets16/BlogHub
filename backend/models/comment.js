const mongoose = require("mongoose");

const commentschema = new mongoose.Schema({
    comment:{
        type: String,
        required: true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",                               //this is the collection name 
        required: true
    },
    blog:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blogs",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const commentmodel = mongoose.model("comments",commentschema);

module.exports = commentmodel;
