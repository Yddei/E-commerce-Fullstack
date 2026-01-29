const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller.js');
const authenticateToken = require('../../middleware/auth.js');

//MIDDLEWARE
router.use(express.json());

//API ROUTES
router.post('/', authenticateToken, ordersController.createOrder);

module.exports = router;