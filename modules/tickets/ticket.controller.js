// modules/tickets/ticket.controller.js
const db = require('../../db/index.js');

exports.submitTicket = async (req, res) => {
    const { category, comment } = req.body;
    const userId = req.user.userId || req.user.id || req.user.user_id; 

    try {
        await db.query(
            'INSERT INTO tickets (user_id, category, comment) VALUES ($1, $2, $3)',
            [userId, category, comment]
        );
        res.status(201).json({ message: "Ticket submitted successfully!" });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error submitting ticket." });
    }
};

//admin side
exports.getAllTickets = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT t.id, t.category, t.comment, t.status, t.created_at, u.email 
            FROM tickets t 
            JOIN users u ON t.user_id = u.id 
            ORDER BY t.created_at DESC
        `);
        res.status(200).json(result.rows);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching tickets." });
    }
};

exports.updateTicketStatus = async (req, res) => {
    const ticketId = req.params.id; // Get the ID from the URL
    const { status } = req.body;    // Get the new status ('Resolved') from the request body

    try {
        await db.query(
            'UPDATE tickets SET status = $1 WHERE id = $2', 
            [status, ticketId]
        );
        res.status(200).json({ message: `Ticket #${ticketId} marked as ${status}.` });
    } 
    catch (err) {
        console.error("Error updating ticket:", err);
        res.status(500).json({ message: "Error updating ticket status." });
    }
};