//EXPRESS CONSTANTS
const express = require('express');
const router = express.Router();
const ticketController = require('./ticket.controller');

//MIDDLWARE
const authenticateToken = require('../../middleware/auth.js');
const checkAdmin = require('../../middleware/admin.js')

//ROUTES
router.post('/submit', authenticateToken, ticketController.submitTicket);
router.get('/admin/all', authenticateToken, checkAdmin, ticketController.getAllTickets);
router.put('/admin/:id/status', authenticateToken, checkAdmin, ticketController.updateTicketStatus);

module.exports = router;