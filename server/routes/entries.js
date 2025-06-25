const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// Get all entries (optionally filter by date)
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    let entries;
    if (date) {
      entries = await Entry.find({ date }).sort({ timestamp: -1 });
    } else {
      entries = await Entry.find().sort({ timestamp: -1 });
    }
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new entry
router.post('/', async (req, res) => {
  try {
    const { mood, note, date, intensity, tags } = req.body;
    const entry = new Entry({
      mood,
      note,
      date,
      intensity,
      tags,
      timestamp: Date.now(),
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an entry
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const entry = await Entry.findByIdAndUpdate(id, updates, { new: true });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Entry.findByIdAndDelete(id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 