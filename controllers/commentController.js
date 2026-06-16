const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const addComment = asyncHandler(async (req, res) => {
  const { text, parentComment } = req.body;
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) throw new AppError('Post not found', 404);

  // Validate parent comment if provided
  if (parentComment) {
    const parent = await Comment.findById(parentComment);
    if (!parent || parent.post.toString() !== postId) {
      throw new AppError('Invalid parent comment', 400);
    }
  }

  const comment = await Comment.create({
    text,
    author: req.user.id,
    post: postId,
    parentComment: parentComment || null,
  });

  const populated = await comment.populate('author', 'name avatar');

  // Create notification for post author (don't notify self)
  if (post.author.toString() !== req.user.id.toString()) {
    await Notification.create({
      recipient: post.author,
      sender: req.user.id,
      type: 'comment',
      post: postId,
      comment: comment._id,
    });
  }

  // If replying, also notify parent comment author
  if (parentComment) {
    const parent = await Comment.findById(parentComment);
    if (parent && parent.author.toString() !== req.user.id.toString()) {
      await Notification.create({
        recipient: parent.author,
        sender: req.user.id,
        type: 'reply',
        post: postId,
        comment: comment._id,
      });
    }
  }

  res.status(201).json({ success: true, comment: populated });
});

const getCommentsByPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const sort = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const post = await Post.findById(postId);
  if (!post) throw new AppError('Post not found', 404);

  const comments = await Comment.find({ post: postId })
    .populate('author', 'name avatar')
    .sort(sort)
    .lean();

  // Build nested tree
  const commentMap = {};
  const roots = [];

  comments.forEach((c) => {
    c.replies = [];
    commentMap[c._id.toString()] = c;
  });

  comments.forEach((c) => {
    if (c.parentComment) {
      const parent = commentMap[c.parentComment.toString()];
      if (parent) {
        parent.replies.push(c);
      } else {
        roots.push(c);
      }
    } else {
      roots.push(c);
    }
  });

  res.json({ success: true, comments: roots, total: comments.length });
});

const editComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new AppError('Comment not found', 404);

  if (comment.author.toString() !== req.user.id.toString()) {
    throw new AppError('Forbidden: only comment author can edit', 403);
  }

  comment.text = req.body.text;
  await comment.save();

  const populated = await comment.populate('author', 'name avatar');
  res.json({ success: true, comment: populated });
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new AppError('Comment not found', 404);

  // Allow admin or comment author to delete
  const isAdmin = req.user.role === 'admin';
  if (!isAdmin && comment.author.toString() !== req.user.id.toString()) {
    throw new AppError('Forbidden: only comment author can delete', 403);
  }

  // Also delete child replies
  await Comment.deleteMany({ parentComment: comment._id });
  await Notification.deleteMany({ comment: comment._id });
  await comment.deleteOne();

  res.json({ success: true, message: 'Comment deleted successfully' });
});

const getCommentCount = asyncHandler(async (req, res) => {
  const count = await Comment.countDocuments({ post: req.params.postId });
  res.json({ success: true, count });
});

module.exports = { addComment, getCommentsByPost, editComment, deleteComment, getCommentCount };
