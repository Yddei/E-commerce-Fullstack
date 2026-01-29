//EXPRESS CONSTANTS
const express = require('express');
const router = express.Router();
const itemsController = require('../items/items.controller.js');

//MIDDLEWARE
router.use(express.json());

//API ROUTES
router.get('/', itemsController.getAllItems);

module.exports = router;