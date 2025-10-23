const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/content
// @desc    Get all content sections
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { section } = req.query;
    const query = section ? { section, isActive: true } : { isActive: true };
    const content = await Content.find(query).sort({ order: 1 });
    res.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/content/:id
// @desc    Get content by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    console.error('Get content by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/content
// @desc    Create new content
// @access  Private
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { section, title, subtitle, description, content, order, isActive } = req.body;

    const images = req.files ? req.files.map((file, index) => ({
      url: `/uploads/${file.filename}`,
      caption: req.body[`caption_${index}`] || '',
      order: index
    })) : [];

    const newContent = new Content({
      section,
      title,
      subtitle,
      description,
      content,
      images,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await newContent.save();
    res.status(201).json(newContent);
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/content/:id
// @desc    Update content
// @access  Private
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { section, title, subtitle, description, content, order, isActive, existingImages } = req.body;

    let images = existingImages ? JSON.parse(existingImages) : [];

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        caption: req.body[`caption_${index}`] || '',
        order: images.length + index
      }));
      images = [...images, ...newImages];
    }

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      {
        section,
        title,
        subtitle,
        description,
        content,
        images,
        order,
        isActive,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedContent) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(updatedContent);
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/content/:id
// @desc    Delete content
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
