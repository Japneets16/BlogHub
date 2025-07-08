const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,

    required: true,
  },

  content: {
    type: String,

    required: true,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User", //means that take the user id from the user collection*

    required: true,
  },

  tags: {
    type: [String],
  },

  createdAt: {
    type: Date,

    default: Date.now,
  },

  //in the likes  requrie the userid to check the users who has likes it*

  likes: {
    type: [mongoose.Schema.Types.ObjectId],

    ref: "User",

    default: [],
  },
});

const blogmodel = mongoose.model("blogs", blogSchema);

module.exports = blogmodel;
