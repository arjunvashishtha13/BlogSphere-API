const { body, param } = require('express-validator');

const addCommentValidation = [
  param('postId').isMongoId().withMessage('Invalid post ID'),
  body('text').trim().notEmpty().withMessage('Comment text is required').isLength({ max: 1000 }),
];

const commentIdValidation = [param('id').isMongoId().withMessage('Invalid comment ID')];

module.exports = { addCommentValidation, commentIdValidation };
