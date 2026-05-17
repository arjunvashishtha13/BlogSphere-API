const express = require('express');
const {
  addComment,
  getCommentsByPost,
  deleteComment,
} = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:postId', authMiddleware, addComment);
router.get('/:postId', getCommentsByPost);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
