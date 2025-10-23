const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/gallery
// @desc    Get all gallery images
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, mediaType } = req.query;
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (mediaType) query.mediaType = mediaType;
    
    const images = await Gallery.find(query).sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/gallery/:id
// @desc    Get gallery image by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    console.error('Get gallery image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/gallery
// @desc    Upload new gallery image or video
// @access  Private
router.post('/', auth, upload.fields([{ name: 'media', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description, category, mediaType, order, isActive } = req.body;

    if (!req.files || !req.files.media) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const newMedia = new Gallery({
      title,
      description,
      category: category || 'other',
      mediaType: mediaType || 'photo',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    if (mediaType === 'video') {
      newMedia.videoUrl = req.files.media[0].path;
      if (req.files.thumbnail) {
        newMedia.thumbnailUrl = req.files.thumbnail[0].path;
      }
    } else {
      newMedia.imageUrl = req.files.media[0].path;
    }

    await newMedia.save();
    res.status(201).json(newMedia);
  } catch (error) {
    console.error('Upload gallery media error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/gallery/:id
// @desc    Update gallery image or video
// @access  Private
router.put('/:id', auth, upload.fields([{ name: 'media', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description, category, mediaType, order, isActive } = req.body;

    const updateData = {
      title,
      description,
      category,
      mediaType,
      order,
      isActive
    };

    if (req.files) {
      if (req.files.media) {
        if (mediaType === 'video') {
          updateData.videoUrl = req.files.media[0].path;
        } else {
          updateData.imageUrl = req.files.media[0].path;
        }
      }
      if (req.files.thumbnail && mediaType === 'video') {
        updateData.thumbnailUrl = req.files.thumbnail[0].path;
      }
    }

    const updatedMedia = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedMedia) {
      return res.status(404).json({ message: 'Media not found' });
    }

    res.json(updatedMedia);
  } catch (error) {
    console.error('Update gallery media error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery image
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
