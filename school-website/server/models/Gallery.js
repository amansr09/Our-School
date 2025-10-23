const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  mediaType: {
    type: String,
    enum: ['photo', 'video'],
    default: 'photo',
    required: true
  },
  category: {
    type: String,
    enum: ['events', 'campus', 'sports', 'cultural', 'academic', 'other'],
    default: 'other'
  },
  imageUrl: {
    type: String
  },
  videoUrl: {
    type: String
  },
  thumbnailUrl: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);
