const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// @route   GET /api/about
// @desc    Get about page content
// @access  Public
router.get('/', async (req, res) => {
  try {
    const aboutSections = await Content.find({ 
      section: { $in: ['about', 'mission', 'vision', 'values'] },
      isActive: true 
    }).sort({ order: 1 });
    res.json(aboutSections);
  } catch (error) {
    console.error('Get about content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
