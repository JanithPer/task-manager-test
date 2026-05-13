const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.headers['x-user-role'];

    if (!role) {
      return res.status(400).json({ message: 'x-user-role header is required' });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: `Access denied. ${role} role does not have permission for this action` });
    }

    req.userRole = role;
    next();
  };
};

module.exports = { authorizeRole };
