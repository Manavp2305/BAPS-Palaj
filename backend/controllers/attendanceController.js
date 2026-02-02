const Attendance = require('../models/Attendance');

// @desc    Mark attendance (Create or Update)
// @route   POST /api/attendance
// @access  Private (Admin only)
const markAttendance = async (req, res) => {
    const { date, records } = req.body;

    // Standardize date to start of day or ISO string
    // Assuming frontend sends YYYY-MM-DD or ISO string
    const attendanceDate = new Date(date).toISOString().split('T')[0];
    
    // Find if attendance exists for this date (using range for day)
    const startDate = new Date(attendanceDate);
    const endDate = new Date(attendanceDate);
    endDate.setDate(endDate.getDate() + 1);

    let attendance = await Attendance.findOne({
        date: {
            $gte: startDate,
            $lt: endDate,
        },
    });

    if (attendance) {
        // Update existing
        attendance.records = records;
        const updatedAttendance = await attendance.save();
        res.json(updatedAttendance);
    } else {
        // Create new
        const newAttendance = new Attendance({
            date: startDate,
            records,
        });
        const savedAttendance = await newAttendance.save();
        res.status(201).json(savedAttendance);
    }
};

// @desc    Get attendance by date
// @route   GET /api/attendance/:date
// @access  Private
const getAttendanceByDate = async (req, res) => {
    const dateStr = req.params.date; // YYYY-MM-DD
    const startDate = new Date(dateStr);
    const endDate = new Date(dateStr);
    endDate.setDate(endDate.getDate() + 1);

    const attendance = await Attendance.findOne({
        date: {
            $gte: startDate,
            $lt: endDate,
        },
    });

    if (attendance) {
        res.json(attendance);
    } else {
        // Return empty or null, not necessarily 404 to avoid errors in frontend
        res.json(null);
    }
};

// @desc    Get dashboard stats
// @route   GET /api/attendance/stats
// @access  Private
const getStats = async (req, res) => {
    // Basic stats implementation
    // This could be moved to dashboardController but keeping here for simplicity
    
    // 1. Total Members
    // This requires Member model, so we might need aggregated query
    // But let's rely on specific dashboard route. 
    // This controller focuses on CRUD of attendance.
    
    // We will just return all attendance for analysis?
    // Let's create a specialized dashboard controller instead.
    res.status(501).json({ message: 'Use dashboard routes' });
};

// @desc    Get attendance history with date filter
// @route   GET /api/attendance/history
// @access  Private
const getAttendanceHistory = async (req, res) => {
    const { startDate, endDate } = req.query;
    
    let query = {};

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate) // Make sure to handle end of day if needed, but simplistic is fine for now
        };
    }

    try {
        const history = await Attendance.find(query).sort({ date: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { markAttendance, getAttendanceByDate, getAttendanceHistory };
