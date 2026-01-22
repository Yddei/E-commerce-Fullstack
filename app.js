//CONFIG
require('dotenv').config();
const port = process.env.PORT;
const express = require('express');
const app = express();
const path = require('path');

//IMPORT APP
app.use(express.static('public'));
app.use(express.json());
const authRoutes = require('./modules/auth/auth.routes.js');
const userRoutes = require('./modules/users/users.routes.js');

//MOUNT ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)

//FRONT END ROUTES
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

//RUN
app.listen(port, ()=>console.log('Server running on PORT ' + port));