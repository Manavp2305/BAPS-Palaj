const Announcement = require('../models/Announcement');
const Member = require('../models/Member');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    res.json(announcements);
};

// @desc    Create announcement and send emails
// @route   POST /api/announcements
// @access  Private (Admin only)
const createAnnouncement = async (req, res) => {
    const { title, message } = req.body;

    const announcement = await Announcement.create({
        title,
        message,
        createdBy: req.user._id,
    });

    // 1. Find all members with email
    const membersWithEmail = await Member.find({ 
        email: { $exists: true, $ne: '' },
        active: true 
    });

    let sentCount = 0;

    // 2. Loop and send (Naive implementation, for production use queues like Bull)
    // Using Promise.allSettled for concurrency
    const emailPromises = membersWithEmail.map(member => 
        sendEmail({
            email: member.email,
            subject: title,
            message: message,
        })
    );
    
    try {
        const results = await Promise.allSettled(emailPromises);
        sentCount = results.filter(r => r.status === 'fulfilled').length;
        
        // Update sent count
        announcement.sentCount = sentCount;
        await announcement.save();
        
        res.status(201).json(announcement);
    } catch (error) {
        console.error('Email sending error:', error);
        // Still return success of creation, but maybe with warning?
        res.status(201).json({ ...announcement.toObject(), warning: 'Some emails may have failed' });
    }
};

module.exports = { getAnnouncements, createAnnouncement };
