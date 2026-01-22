//EXPRESS CONSTANTS
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller.js');

//MIDDLEWARE
router.use(express.json());

//API ROUTES
router.post('/register', authController.register);
router.post('/login', authController.login)

module.exports = router;