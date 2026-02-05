//EXPRESS CONSTANTS
const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller.js');

//MIDDLWARE
const authenticateToken = require('../../middleware/auth.js');
const checkAdmin = require('../../middleware/admin');

//MIDDLEWARE
router.use(express.json());

//API ROUTES
router.post('/', authenticateToken, ordersController.createOrder);
//admin only
router.get('/', authenticateToken, checkAdmin, ordersController.getAllOrders);

module.exports = router;