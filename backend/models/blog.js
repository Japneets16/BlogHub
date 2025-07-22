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
  // feature 8: category management*
  category: {
    type: String,
    enum: ['Technology', 'Health', 'Travel', 'Food', 'Lifestyle', 'Business', 'Education', 'Entertainment', 'Sports', 'Other'],
    default: 'Other'
  },
  tags: {
    type: [String],
  },
  // feature 4: file upload system for featured images*
  featuredImage: {
    type: String,
    default: null
  },
  // feature 5: analytics - views tracking*
  views: {
    type: Number,
    default: 0
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

// feature 1: create text index for advanced search*
blogSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text',
  category: 'text'
});

const blogmodel = mongoose.model("blogs", blogSchema);

module.exports = blogmodel;
