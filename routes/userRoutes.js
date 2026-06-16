const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getPublicProfile,
  getUserPosts,
  toggleBookmark,
  getBookmarks,
  getReadingHistory,
  getAnalytics,
  getRecommendations,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { param } = require('express-validator');

const router = express.Router();

const userIdValidation = [param('id').isMongoId().withMessage('Invalid user ID')];
const postIdValidation = [param('postId').isMongoId().withMessage('Invalid post ID')];

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/posts', authMiddleware, getUserPosts);
router.get('/bookmarks', authMiddleware, getBookmarks);
router.post('/bookmarks/:postId', authMiddleware, postIdValidation, validate, toggleBookmark);
router.get('/history', authMiddleware, getReadingHistory);
router.get('/analytics', authMiddleware, getAnalytics);
router.get('/recommendations', authMiddleware, getRecommendations);
router.get('/:id', userIdValidation, validate, getPublicProfile);

module.exports = router;
