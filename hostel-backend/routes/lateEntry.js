// routes/lateEntry.js
const express = require('express');
const router = express.Router();
const LateEntry = require('../models/LateEntry');

// GET all late entries
router.get('/', async (req, res) => {
  const entries = await LateEntry.find().sort({ date: -1 });
  res.json(entries);
});

// POST a new late entry
router.post('/', async (req, res) => {
  const { studentName, time, reason, date } = req.body;

  if (!studentName || !time || !reason || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const entry = new LateEntry({ studentName, time, reason, date });
  await entry.save();
  res.json({ message: 'Late entry recorded successfully' });
});

// PUT: Mark fine paid
router.put('/:id/payfine', async (req, res) => {
  await LateEntry.findByIdAndUpdate(req.params.id, { finePaid: true });
  res.json({ message: 'Fine marked as paid' });
});

module.exports = router;
