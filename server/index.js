// Optional local workaround only. Keep TLS verification enabled by default.
if (process.env.ALLOW_INSECURE_TLS === 'true') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.warn('⚠️ TLS certificate verification is disabled (ALLOW_INSECURE_TLS=true). Do not use this in production.');
}

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// View engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors({
    origin: [
        process.env.CLIENT_URL || 'http://localhost:3000',
        process.env.ADMIN_URL || 'http://localhost:3001',
    ],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Session (for EJS shop cart)
app.use(session({
    secret: process.env.SESSION_SECRET || 'hobbyshop_session_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/hobbyshop',
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
}));

// API routes
app.use('/api/admin', require('./api/admin'));
app.use('/api/customer', require('./api/customer'));

// EJS shop routes
app.use('/shop', require('./api/shop'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
