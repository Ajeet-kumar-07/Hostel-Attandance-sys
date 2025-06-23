
const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
  date: String,
  records: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      status: String,
    }
  ]
});
module.exports = mongoose.model('Attendance', attendanceSchema);
