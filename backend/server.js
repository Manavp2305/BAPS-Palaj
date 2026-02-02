const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to Database
// Connect to Database (Middleware for Vercel/Serverless)
const app = express();

app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (err) {
        console.error('Database connection error:', err);
        // We don't exit here, let the error handler catch it or individual routes fail
        // But if DB is down, everything DB-related will fail.
    }
    next();
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
