const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement } = require('../controllers/announcementController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAnnouncements).post(protect, adminOnly, createAnnouncement);

module.exports = router;
