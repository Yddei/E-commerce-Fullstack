const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');

const authenticateToken = require('../../middleware/auth.js');
const checkAdmin = require('../../middleware/admin');

router.get('/stats', authenticateToken, checkAdmin, adminController.getDashboardStats);

module.exports = router;