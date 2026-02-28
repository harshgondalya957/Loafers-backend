require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser'); // Deprecated in Express 4.16+

const app = express();
const PORT = process.env.PORT || 5000; // Changed to 5000 as requested
// Server restart trigger for env update

// Middleware
app.use(cors({
    origin: [
        "https://loafers-acd5th8e9-gondaliyaharsh54-3084s-projects.vercel.app",
        "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json()); // Built-in middleware

// Request Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
const adminRoutes = require('./routes/adminRoutes');
const shopRoutes = require('./routes/shopRoutes');
const storeRoutes = require('./routes/storeRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

// Use Routes
app.use('/api/admin', adminRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Loaferss Backend Running');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

const mongoose = require('mongoose');

let server;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            dbName: 'loafer' // Match existing DB name from screenshot
        });
        console.log('MongoDB Connected Successfully');

        server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('\n❌ MongoDB Connection Error ❌');
        console.error('Reason: ', err.message);
        console.error('=> Hint: Your current internet IP address is not whitelisted on MongoDB Atlas.');
        console.error('=> Fix: Go to cloud.mongodb.com -> Network Access -> Add IP Address -> Allow Access From Anywhere (0.0.0.0/0)\n');
        process.exit(1);
    }
};

startServer();

// Handle graceful shutdown and errors
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...', err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});
