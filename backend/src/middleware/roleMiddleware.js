const jwt = require('jsonwebtoken');
const User = require('../models/User');
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("Authorization Header:", authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Extracted Token:", token);
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        if (user.role === 'ADMIN') {
            req.user = user;
            next();
        } else {
            res.status(403).json({ error: "Access denied: Permissions revoked." });
        }
    });
};

module.exports = requireAdmin;
