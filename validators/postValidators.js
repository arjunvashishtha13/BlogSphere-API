const { body, param, query } = require('express-validator');
const { CATEGORIES } = require('../models/Post');

const createPostValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').optional().isIn(CATEGORIES).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Invalid status'),
];

const updatePostValidation = [
  param('id').isMongoId().withMessage('Invalid post ID'),
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('content').optional().trim().notEmpty(),
  body('category').optional().isIn(CATEGORIES),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published']),
];

const postIdValidation = [param('id').isMongoId().withMessage('Invalid post ID')];

const listPostsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(CATEGORIES),
  query('status').optional().isIn(['draft', 'published']),
];

module.exports = {
  createPostValidation,
  updatePostValidation,
  postIdValidation,
  listPostsValidation,
};
