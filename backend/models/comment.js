const mongoose = require("mongoose");

const commentschema = new mongoose.Schema({
    comment:{
        type: String,
        required: true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
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
    },
    // For nested comments
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments',
        default: null
    },
    // For moderation (admin can hide)
    isHidden: {
        type: Boolean,
        default: false
    }
});

const commentmodel = mongoose.model("comments",commentschema);

module.exports = commentmodel;