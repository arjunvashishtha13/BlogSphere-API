const express = require('express');
const {
  addComment,
  getCommentsByPost,
  deleteComment,
} = require('../controllers/commentController');
const { addCommentValidation, commentIdValidation } = require('../validators/commentValidators');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.post('/:postId', authMiddleware, addCommentValidation, validate, addComment);
router.get('/:postId', getCommentsByPost);
router.delete('/:id', authMiddleware, commentIdValidation, validate, deleteComment);

module.exports = router;
