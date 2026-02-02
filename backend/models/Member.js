const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true // Allow null/multiple nulls since email is optional
    },
    mobile: {
        type: String,
    },
    role: {
        type: String,
        default: 'member', // Just a label for now
    },
    active: {
        type: Boolean,
        default: true,
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
