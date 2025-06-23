
const Attendance = require('../models/Attendance');

exports.saveAttendance = async (req, res) => {
  const { date, records } = req.body;
  const existing = await Attendance.findOne({ date });
  if (existing) {
    existing.records = records;
    await existing.save();
    return res.json(existing);
  } else {
    const attendance = new Attendance({ date, records });
    await attendance.save();
    res.status(201).json(attendance);
  }
};

exports.getAttendanceByDate = async (req, res) => {
  const attendance = await Attendance.findOne({ date: req.params.date }).populate('records.studentId');
  res.json(attendance || {});
};
