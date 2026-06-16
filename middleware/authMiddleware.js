const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Unauthorized: token missing', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded?.userId) {
    throw new AppError('Unauthorized: invalid token', 401);
  }

  const user = await User.findById(decoded.userId).select('-password');
  if (!user) {
    throw new AppError('Unauthorized: user not found', 401);
  }

  req.user = { id: user._id, email: user.email, name: user.name };
  next();
});

module.exports = authMiddleware;
