//EXPRESS CONSTANTS
const express = require('express');
const router = express.Router();
const reviewsController = require('./reviews.controller');

//MIDDLEWARE
const authenticateToken = require('../../middleware/auth.js');
const checkAdmin = require('../../middleware/admin');

//ROUTES
router.get('/', reviewsController.getAllReviews);

//only logged in can write review
router.post('/', authenticateToken, reviewsController.addReview);
//only admin can delete
router.delete('/:id', authenticateToken, checkAdmin, reviewsController.deleteReview);


module.exports = router;