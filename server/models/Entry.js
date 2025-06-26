const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  mood: { type: String, required: true },
  note: { type: String, required: true },
  date: { type: String, required: true },
  intensity: { type: Number },
  timestamp: { type: Number, required: true },
  tags: [{ type: String }],
});

module.exports = mongoose.model('Entry', EntrySchema); 