const jwt = require('jsonwebtoken');
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("Authorization Header:", authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Extracted Token:", token);
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        if (decoded.role === 'ADMIN') {
            req.user = decoded;
            next();
        } else {
            res.status(403).json({ error: "Access denied: Admin role required" });
        }
    });
};

module.exports = requireAdmin;
