const express = require('express');
const router = express.Router();
const { markAttendance, getAttendanceByDate, getAttendanceHistory } = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/history', protect, getAttendanceHistory);
router.post('/', protect, adminOnly, markAttendance);
router.get('/:date', protect, getAttendanceByDate);

module.exports = router;
