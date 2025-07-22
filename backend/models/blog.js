const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    maxlength: 300
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: ['Technology', 'Health', 'Travel', 'Food', 'Lifestyle', 'Business', 'Education', 'Entertainment', 'Sports', 'Other'],
    default: 'Other'
  },
  tags: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 10']
  },
  featuredImage: {
    type: String,
    default: null
  },
  readingTime: {
    type: Number, // in minutes
    default: 1
  },
  views: {
    type: Number,
    default: 0
  },
  viewedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  bookmarkedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Custom validator for tags array length
function arrayLimit(val) {
  return val.length <= 10;
}

// Virtual for like count
blogSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count (will be calculated separately)
blogSchema.virtual('commentCount', {
  ref: 'comments',
  localField: '_id',
  foreignField: 'blog',
  count: true
});

// Pre-save middleware to generate slug and calculate reading time
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      .substring(0, 50);
  }
  
  if (this.isModified('content')) {
    // Calculate reading time (average 200 words per minute)
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
    this.lastModified = new Date();
  }
  
  next();
});

// Create text index for search
blogSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text',
  category: 'text'
});

const blogmodel = mongoose.model("blogs", blogSchema);

module.exports = blogmodel;
