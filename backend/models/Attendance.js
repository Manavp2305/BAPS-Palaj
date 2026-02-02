const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true, // Should be unique per date, ensure strict checking in controller
    },
    records: [{
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true,
        },
        status: {
            type: String,
            enum: ['Present', 'Absent'],
            required: true,
        },
    }],
}, {
    timestamps: true,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
