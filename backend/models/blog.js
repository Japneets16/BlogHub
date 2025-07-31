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
    ref: "User",
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Image upload (file path or URL)
  image: {
    type: String,
  },
  // Blog analytics: view count
  views: {
    type: Number,
    default: 0,
  },
  // Likes: array of user IDs
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

// Full-text search index
blogSchema.index({ title: 'text', content: 'text' });

const blogmodel = mongoose.model("blogs", blogSchema);

module.exports = blogmodel;