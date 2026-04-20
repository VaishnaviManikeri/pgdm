const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  metaTitle: {
    type: String,
    required: true,
    trim: true
  },
  metaDescription: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    default: 'Admin',
    trim: true
  },
  featuredImage: {
    type: String,
    required: true
  },
  featuredImagePublicId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  readingTime: {
    type: Number,
    default: 5
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Remove the pre-save middleware since we're creating slug in controller
// module.exports = mongoose.model('Blog', blogSchema);

module.exports = mongoose.model('Blog', blogSchema);