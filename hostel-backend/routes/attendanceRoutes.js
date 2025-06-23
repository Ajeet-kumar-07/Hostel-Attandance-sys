
const express = require('express');
const router = express.Router();
const attendanceCtrl = require('../controllers/attendanceController');

router.post('/', attendanceCtrl.saveAttendance);
router.get('/:date', attendanceCtrl.getAttendanceByDate);

module.exports = router;
