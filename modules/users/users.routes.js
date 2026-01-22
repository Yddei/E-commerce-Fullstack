const express = require('express');
const router = express.Router();
const userController = require('./users.controller.js');
const authenticateToken = require('../../middleware/auth.js');

//MIDDLEWARE
router.use(express.json());

//API ROUTES
router.get('/profile', authenticateToken, userController.getProfile);

module.exports = router;