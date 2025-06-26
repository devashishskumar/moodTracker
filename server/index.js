const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const entriesRouter = require('./routes/entries');
const authRouter = require('./routes/auth');

app.use('/api/entries', entriesRouter);
app.use('/api/auth', authRouter);

app.get('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/moodtracker';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err)); 

  