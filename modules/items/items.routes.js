//EXPRESS CONSTANTS
const express = require('express');
const router = express.Router();
const itemsController = require('../items/items.controller.js');

const authenticateToken = require('../../middleware/auth.js');
const checkAdmin = require('../../middleware/admin');

//MIDDLEWARE
router.use(express.json());

//API ROUTES
router.get('/', itemsController.getAllItems);
//admin only
router.post('/', authenticateToken, checkAdmin, itemsController.createItem);
router.delete('/:id', authenticateToken, checkAdmin, itemsController.deleteItem);

module.exports = router;