const db = require('../../db/index.js');
const { z } = require('zod');

//zod validation
const createReviewSchema = z.object({
    rating: z.coerce.number().min(1).max(5),
    comment: z.string()
        .min(1, "Comment cannot be empty")
        .max(500, "Comment is too long")
        .transform((str) => {
            //xss sanitisation
            return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        })
});


//all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT reviews.id, reviews.rating, reviews.comment, reviews.created_at, users.username 
             FROM reviews 
             JOIN users ON reviews.user_id = users.id 
             ORDER BY reviews.created_at DESC`
        );
        res.json(result.rows);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching reviews" });
    }
};

//add review
exports.addReview = async (req, res) => {
    const userId = req.user.userId || req.user.id || req.user.user_id;

    try {
        //zod
        const data = createReviewSchema.parse(req.body);

        //pass zod
        await db.query(
            'INSERT INTO reviews (user_id, rating, comment) VALUES ($1, $2, $3)',
            [userId, data.rating, data.comment]
        );

        res.status(201).json({ message: "Review added successfully" });

    } 
    catch (err) {
        //zod error
        if (err instanceof z.ZodError) {
            return res.status(400).json({ 
                message: "Validation Error", 
                errors: err.errors.map(e => e.message) 
            });
        }
        
        console.error(err);
        res.status(500).json({ message: "Error adding review" });
    }
};

//delete review for admin
exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM reviews WHERE id = $1', [id]);
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting review" });
    }
};