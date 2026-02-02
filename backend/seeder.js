const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors'); // Optional if not installed, removing colors usage to be safe
const User = require('./models/User');
const Member = require('./models/Member');
const Attendance = require('./models/Attendance');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Member.deleteMany();
        await Attendance.deleteMany();

        const users = [
            {
                name: 'Admin User',
                email: 'admin@baps.com',
                password: 'password123',
                role: 'admin',
            },
            {
                name: 'UK Super Admin',
                email: 'super@baps.com',
                password: 'password123',
                role: 'superadmin',
            },
        ];

        await User.create(users);

        const members = [
            { name: 'Ravi Patel', email: 'ravi@example.com', mobile: '9876543210', active: true },
            { name: 'Sunny Shah', email: 'sunny@example.com', mobile: '9876543211', active: true },
            { name: 'Kishan Kumar', mobile: '9876543212', active: false },
            { name: 'Priya Joshi', email: 'priya@example.com', active: true },
            { name: 'Amit Trivedi', mobile: '9876543214', active: true },
        ];

        await Member.create(members);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Member.deleteMany();
        await Attendance.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
