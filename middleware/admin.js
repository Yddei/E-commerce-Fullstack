const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // You are an admin, proceed.
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
};

module.exports = checkAdmin;