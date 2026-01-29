const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');

const authenticateToken = require('../../middleware/auth.js'); // Your existing auth
const checkAdmin = require('../../middleware/admin'); // The new one

router.get('/', authenticateToken, checkAdmin, adminController.getDashboardStats);

module.exports = router;