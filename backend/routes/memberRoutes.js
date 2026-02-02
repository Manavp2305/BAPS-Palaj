const express = require('express');
const router = express.Router();
const {
    getMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
} = require('../controllers/memberController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMembers).post(protect, adminOnly, createMember);
router
    .route('/:id')
    .get(protect, getMemberById)
    .put(protect, adminOnly, updateMember)
    .delete(protect, adminOnly, deleteMember);

module.exports = router;
