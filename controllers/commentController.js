const Comment = require('../models/Comment');
const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) throw new AppError('Post not found', 404);

  const comment = await Comment.create({
    text,
    author: req.user.id,
    post: postId,
  });

  const populated = await comment.populate('author', 'name avatar');
  res.status(201).json({ success: true, comment: populated });
});

const getCommentsByPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) throw new AppError('Post not found', 404);

  const comments = await Comment.find({ post: postId })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });

  res.json({ success: true, comments });
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new AppError('Comment not found', 404);

  if (comment.author.toString() !== req.user.id.toString()) {
    throw new AppError('Forbidden: only comment author can delete', 403);
  }

  await comment.deleteOne();
  res.json({ success: true, message: 'Comment deleted successfully' });
});

module.exports = { addComment, getCommentsByPost, deleteComment };
