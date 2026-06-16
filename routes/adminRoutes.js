const express = require('express');
const {
  getStats,
  getUsers,
  banUser,
  unbanUser,
  deleteUser,
  deletePost,
  toggleFeaturePost,
  deleteComment,
  getAnalytics,
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);
router.delete('/users/:id', deleteUser);
router.delete('/posts/:id', deletePost);
router.put('/posts/:id/feature', toggleFeaturePost);
router.delete('/comments/:id', deleteComment);
router.get('/analytics', getAnalytics);

module.exports = router;
