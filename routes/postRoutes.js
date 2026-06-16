const express = require('express');
const {
  createPost,
  getAllPosts,
  getFeaturedPosts,
  getTrendingPosts,
  getPostById,
  getRelatedPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getCategories,
} = require('../controllers/postController');
const {
  createPostValidation,
  updatePostValidation,
  postIdValidation,
  listPostsValidation,
} = require('../validators/postValidators');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.get('/featured', getFeaturedPosts);
router.get('/trending', getTrendingPosts);
router.get('/categories', getCategories);

router.post('/', authMiddleware, createPostValidation, validate, createPost);
router.get('/', listPostsValidation, validate, optionalAuth, getAllPosts);
router.get('/:id/related', postIdValidation, validate, getRelatedPosts);
router.get('/:id', postIdValidation, validate, optionalAuth, getPostById);
router.put('/:id', authMiddleware, updatePostValidation, validate, updatePost);
router.delete('/:id', authMiddleware, postIdValidation, validate, deletePost);
router.post('/:id/like', authMiddleware, postIdValidation, validate, likePost);
router.post('/:id/unlike', authMiddleware, postIdValidation, validate, unlikePost);

module.exports = router;
