const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/faculty
// @desc    Get all faculty members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { department } = req.query;
    const query = department ? { department, isActive: true } : { isActive: true };
    const faculty = await Faculty.find(query).sort({ order: 1, name: 1 });
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/faculty/:id
// @desc    Get faculty member by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/faculty
// @desc    Add new faculty member
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, designation, department, qualification, experience, email, phone, bio, specialization, order, isActive } = req.body;

    const newFaculty = new Faculty({
      name,
      designation,
      department,
      qualification,
      experience,
      email,
      phone,
      bio,
      specialization: specialization ? JSON.parse(specialization) : [],
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await newFaculty.save();
    res.status(201).json(newFaculty);
  } catch (error) {
    console.error('Create faculty error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/faculty/:id
// @desc    Update faculty member
// @access  Private
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, designation, department, qualification, experience, email, phone, bio, specialization, order, isActive } = req.body;

    const updateData = {
      name,
      designation,
      department,
      qualification,
      experience,
      email,
      phone,
      bio,
      order,
      isActive
    };

    // Handle specialization - it might be a string or already parsed
    if (specialization) {
      try {
        updateData.specialization = typeof specialization === 'string' ? JSON.parse(specialization) : specialization;
      } catch (e) {
        // If it's not valid JSON, treat it as a simple string
        updateData.specialization = specialization;
      }
    }

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFaculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }

    res.json(updatedFaculty);
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/faculty/:id
// @desc    Delete faculty member
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    res.json({ message: 'Faculty member deleted successfully' });
  } catch (error) {
    console.error('Delete faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
