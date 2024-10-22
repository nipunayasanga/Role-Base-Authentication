const jwt = require("jsonwebtoken");

// Middleware to authenticate and verify the JWT token.
const authenticateToken = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware for role-based authorization
// Pass the required role (e.g., 'admin') to restrict access to certain routes.
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Access denied: Insufficient privileges" });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};
