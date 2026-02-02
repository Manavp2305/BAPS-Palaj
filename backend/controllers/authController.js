const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Check .env Admin Credentials first
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        // Create a dummy ID for the env admin if they don't exist in DB, 
        // OR we can just generate a token with a special ID.
        // For consistency with middleware that looks up user by ID, 
        // we might run into issues if this ID doesn't exist in DB.
        
        // Strategy: 
        // If we want FULL .env auth without DB record, we need to adjust middleware 'protect' too.
        // OR, we just proceed here and assume the middleware might fail if it can't find the user?
        // Let's upsert (find or create) this admin in the DB to ensure middleware works.
        
        let adminUser = await User.findOne({ email });
        if (!adminUser) {
            // Create him on the fly if he logged in via .env credentials but doesn't exist
            adminUser = await User.create({
                name: 'Master Admin',
                email: email,
                password: await require('bcryptjs').hash(password, 10),
                role: 'admin'
            });
        }
        
        res.json({
            _id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
            token: generateToken(adminUser._id),
        });
        return;
    }

    // 2. Normal DB Check
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user (Seed only)
// @route   POST /api/auth/register
// @access  Public (Should be protected in prod)
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

module.exports = { loginUser, registerUser };
