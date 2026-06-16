const express = require('express');
const {
  addComment,
  getCommentsByPost,
  editComment,
  deleteComment,
  getCommentCount,
} = require('../controllers/commentController');
const { addCommentValidation, commentIdValidation } = require('../validators/commentValidators');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { commentLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

router.post('/:postId', authMiddleware, commentLimiter, addCommentValidation, validate, addComment);
router.get('/:postId', getCommentsByPost);
router.get('/:postId/count', getCommentCount);
router.put('/:id', authMiddleware, commentIdValidation, validate, editComment);
router.delete('/:id', authMiddleware, commentIdValidation, validate, deleteComment);

module.exports = router;
