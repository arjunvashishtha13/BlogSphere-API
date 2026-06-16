const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// Dashboard stats
const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalPosts, totalComments, totalViewsAgg] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments({ status: 'published' }),
    Comment.countDocuments(),
    Post.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalPosts,
      totalComments,
      totalViews: totalViewsAgg[0]?.total || 0,
    },
  });
});

// User management
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find()
      .select('name email role isBanned isVerified createdAt avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(),
  ]);

  res.json({ success: true, users, total, page, totalPages: Math.ceil(total / limit) });
});

const banUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'admin') throw new AppError('Cannot ban an admin', 400);

  user.isBanned = true;
  await user.save();
  res.json({ success: true, message: `User ${user.name} has been banned` });
});

const unbanUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);

  user.isBanned = false;
  await user.save();
  res.json({ success: true, message: `User ${user.name} has been unbanned` });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'admin') throw new AppError('Cannot delete an admin', 400);

  // Cascade delete user's content
  await Promise.all([
    Post.deleteMany({ author: user._id }),
    Comment.deleteMany({ author: user._id }),
    Notification.deleteMany({ $or: [{ sender: user._id }, { recipient: user._id }] }),
    user.deleteOne(),
  ]);

  res.json({ success: true, message: `User ${user.name} has been deleted` });
});

// Post moderation — list all posts
const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';

  const filter = search
    ? { title: { $regex: search, $options: 'i' } }
    : {};

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .select('title status isFeatured views likes category createdAt author coverImage')
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);

  const postsWithLikeCount = posts.map((p) => ({
    ...p,
    likeCount: p.likes?.length ?? 0,
  }));

  res.json({ success: true, posts: postsWithLikeCount, total, page, totalPages: Math.ceil(total / limit) });
});

// Post moderation
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  await Promise.all([
    Comment.deleteMany({ post: post._id }),
    Notification.deleteMany({ post: post._id }),
    post.deleteOne(),
  ]);

  res.json({ success: true, message: 'Post deleted by admin' });
});

const toggleFeaturePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  post.isFeatured = !post.isFeatured;
  await post.save();

  res.json({ success: true, isFeatured: post.isFeatured, message: post.isFeatured ? 'Post featured' : 'Post unfeatured' });
});

// Comment moderation — list all comments
const getComments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 30;
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    Comment.find()
      .select('text author post createdAt')
      .populate('author', 'name email avatar')
      .populate('post', 'title _id')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Comment.countDocuments(),
  ]);

  res.json({ success: true, comments, total, page, totalPages: Math.ceil(total / limit) });
});

// Comment moderation
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new AppError('Comment not found', 404);

  await Comment.deleteMany({ parentComment: comment._id });
  await comment.deleteOne();

  res.json({ success: true, message: 'Comment deleted by admin' });
});

// Analytics
const getAnalytics = asyncHandler(async (req, res) => {
  const [mostViewed, mostLiked, newUsers] = await Promise.all([
    Post.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(10)
      .select('title views author createdAt')
      .populate('author', 'name')
      .lean(),
    Post.aggregate([
      { $match: { status: 'published' } },
      { $project: { title: 1, likeCount: { $size: '$likes' }, author: 1, createdAt: 1 } },
      { $sort: { likeCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorData',
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      { $addFields: { author: { $arrayElemAt: ['$authorData', 0] } } },
      { $project: { authorData: 0 } },
    ]),
    User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt avatar role')
      .lean(),
  ]);

  res.json({ success: true, mostViewed, mostLiked, newUsers });
});

module.exports = {
  getStats,
  getUsers,
  banUser,
  unbanUser,
  deleteUser,
  getPosts,
  deletePost,
  toggleFeaturePost,
  getComments,
  deleteComment,
  getAnalytics,
};
