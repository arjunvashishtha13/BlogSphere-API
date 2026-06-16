const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.userId) {
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = { id: user._id, email: user.email, name: user.name };
      }
    }
  } catch {
    // Ignore invalid tokens for optional auth
  }
  next();
});

module.exports = optionalAuth;
