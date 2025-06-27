// models/LateEntry.js
const mongoose = require('mongoose');

const lateEntrySchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  time: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: String, required: true },
  finePaid: { type: Boolean, default: false }
});

module.exports = mongoose.model('LateEntry', lateEntrySchema);
