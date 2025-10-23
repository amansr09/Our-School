const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['school-name', 'hero', 'about', 'mission', 'vision', 'values', 'facilities', 'achievements', 'programs', 'contact', 'footer']
  },
  title: {
    type: String,
    required: true
  },
  subtitle: String,
  description: String,
  content: String,
  images: [{
    url: String,
    caption: String,
    order: Number
  }],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Content', contentSchema);
