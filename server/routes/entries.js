const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all entries (filtered by user role)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};
    
    // If user is not admin, only show their own entries
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }
    
    // Add date filter if provided
    if (date) {
      query.date = date;
    }
    
    const entries = await Entry.find(query)
      .populate('user', 'username email role')
      .sort({ timestamp: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get entries by user ID (admin only)
router.get('/user/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    let query = { user: userId };
    
    if (date) {
      query.date = date;
    }
    
    const entries = await Entry.find(query)
      .populate('user', 'username email role')
      .sort({ timestamp: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { mood, note, date, intensity, tags } = req.body;
    const entry = new Entry({
      user: req.user._id,
      mood,
      note,
      date,
      intensity,
      tags,
      timestamp: Date.now(),
    });
    await entry.save();
    
    // Populate user info before sending response
    await entry.populate('user', 'username email role');
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an entry (user can only update their own entries, admin can update any)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find the entry first
    const entry = await Entry.findById(id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    // Check if user can update this entry
    if (req.user.role !== 'admin' && entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const updatedEntry = await Entry.findByIdAndUpdate(id, updates, { new: true })
      .populate('user', 'username email role');
    res.json(updatedEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an entry (user can only delete their own entries, admin can delete any)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the entry first
    const entry = await Entry.findById(id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    // Check if user can delete this entry
    if (req.user.role !== 'admin' && entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await Entry.findByIdAndDelete(id);
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 