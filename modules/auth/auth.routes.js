//EXPRESS CONSTANTS
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller.js');

//MIDDLEWARE
router.use(express.json());

//API ROUTES
router.post('/register', authController.register);
router.post('/login', authController.login)
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password', authController.verifyAndResetPassword);
module.exports = router;