
const express = require('express');
const router = express.Router();
const studentCtrl = require('../controllers/studentController');

router.get('/', studentCtrl.getStudents);
router.post('/', studentCtrl.createStudent);
router.delete('/:id', studentCtrl.deleteStudent);
router.put('/:id', studentCtrl.updateStudent);

module.exports = router;
