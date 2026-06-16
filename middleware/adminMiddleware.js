const AppError = require('../utils/AppError');

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('Access denied: admin privileges required', 403);
  }
  next();
};

module.exports = adminMiddleware;
