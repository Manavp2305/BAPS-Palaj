const mongoose = require('mongoose');

const announcementSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    sentCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
