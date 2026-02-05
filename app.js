//CONFIG
require('dotenv').config();
const port = process.env.PORT;
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors')
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const https = require('https')
const fs = require('fs')

//CORS - preventing unauthorised requests
const allowedOrigins = [
    'https://localhost:8000',
    'https://127.0.0.1:8000',
];

const corsOptions = {
    origin: function (origin, callback) {
        //Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Origin is in the whitelist
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } 
        // Origin not in whitelist
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Only allow these HTTP verbs
    allowedHeaders: ['Content-Type', 'Authorization'], // Only allow these headers
    credentials: true //Allow cookies/sessions
};

//Rate limit - preventing ddos, brute force
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, //each ip max 100 per 15mins
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false, 
});
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3, // Limit each IP to 10 login attempts per 10mins
    message: { message: "Too many login attempts. Please try again after 10 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

//IMPORT APP
app.use(express.json());
app.use(morgan('dev', {
    stream: { write: (message) => console.log(message.trim()) }
}));
app.use(express.static('public'));
app.use(cors(corsOptions))
app.use(globalLimiter);
const authRoutes = require('./modules/auth/auth.routes.js');
const userRoutes = require('./modules/users/users.routes.js');
const itemRoutes = require('./modules/items/items.routes.js');
const orderRoutes = require('./modules/orders/orders.routes.js');
const adminRoutes = require('./modules/admin/admin.routes.js');
const reviewRoutes = require('./modules/reviews/reviews.routes.js')

//MOUNT ROUTES
//ratelimited ones
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes)

//FRONT END ROUTES
//home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});
//shop
app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shop.html'));
});
//admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'admin.html'));
});
//reviews
app.get('/reviews', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reviews.html'));
});

const sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

//RUN
https.createServer(sslOptions, app).listen(port, () => {
    console.log(`Secure Server running on HTTPS PORT ${port}`);
});