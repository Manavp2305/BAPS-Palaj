const Member = require('../models/Member');

// @desc    Get all members
// @route   GET /api/members
// @access  Private (Admin/SuperAdmin)
const getMembers = async (req, res) => {
    const members = await Member.find({}).sort({ name: 1 });
    res.json(members);
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Private
const getMemberById = async (req, res) => {
    const member = await Member.findById(req.params.id);
    if (member) {
        res.json(member);
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
};

// @desc    Create a member
// @route   POST /api/members
// @access  Private (Admin only)
const createMember = async (req, res) => {
    const { name, email, mobile, joinDate, active } = req.body;

    // Check if email exists if provided
    if (email) {
        const memberExists = await Member.findOne({ email });
        if (memberExists) {
            res.status(400).json({ message: 'Member with this email already exists' });
            return;
        }
    }

    const member = new Member({
        name,
        email,
        mobile,
        joinDate,
        active,
    });

    const createdMember = await member.save();
    res.status(201).json(createdMember);
};

// @desc    Update a member
// @route   PUT /api/members/:id
// @access  Private (Admin only)
const updateMember = async (req, res) => {
    const member = await Member.findById(req.params.id);

    if (member) {
        member.name = req.body.name || member.name;
        member.email = req.body.email || member.email;
        member.mobile = req.body.mobile || member.mobile;
        member.active = req.body.active !== undefined ? req.body.active : member.active;
        member.joinDate = req.body.joinDate !== undefined ? req.body.joinDate : member.joinDate;

        const updatedMember = await member.save();
        res.json(updatedMember);
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
};

// @desc    Delete a member
// @route   DELETE /api/members/:id
// @access  Private (Admin only)
const deleteMember = async (req, res) => {
    const member = await Member.findById(req.params.id);

    if (member) {
        await member.deleteOne();
        res.json({ message: 'Member removed' });
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
};

module.exports = {
    getMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
};
