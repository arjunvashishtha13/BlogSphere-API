const Post = require('../models/Post');
const Comment = require('../models/Comment');
const ReadingHistory = require('../models/ReadingHistory');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const populatePost = (query) =>
  query.populate('author', 'name bio avatar').select('-__v');

const buildListQuery = (query, userId) => {
  const filter = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.tag) {
    filter.tags = query.tag;
  }

  if (query.status) {
    filter.status = query.status;
  } else if (!userId || query.author !== userId) {
    filter.status = 'published';
  }

  if (query.author) {
    filter.author = query.author;
  }

  return filter;
};

const createPost = asyncHandler(async (req, res) => {
  const { title, content, tags, category, status, excerpt } = req.body;

  const post = await Post.create({
    title,
    content,
    tags: tags || [],
    category: category || 'Technology',
    status: status || 'published',
    excerpt,
    author: req.user.id,
  });

  const populated = await populatePost(Post.findById(post._id));
  res.status(201).json({ success: true, post: populated });
});

const getAllPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const filter = buildListQuery(req.query, req.user?.id);

  const sortField = req.query.sort === 'views' ? { views: -1 } : { createdAt: -1 };

  const [posts, total] = await Promise.all([
    populatePost(Post.find(filter).sort(sortField).skip(skip).limit(limit)),
    Post.countDocuments(filter),
  ]);

  res.json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    posts,
  });
});

const getFeaturedPosts = asyncHandler(async (req, res) => {
  const posts = await populatePost(
    Post.find({ status: 'published' })
      .sort({ likes: -1, views: -1 })
      .limit(6)
  );
  res.json({ success: true, posts });
});

const getTrendingPosts = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const posts = await populatePost(
    Post.find({ status: 'published', createdAt: { $gte: sevenDaysAgo } })
      .sort({ views: -1, likes: -1 })
      .limit(8)
  );
  res.json({ success: true, posts });
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await populatePost(Post.findById(req.params.id));

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.status === 'draft' && post.author._id.toString() !== req.user?.id?.toString()) {
    throw new AppError('Post not found', 404);
  }

  await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  post.views += 1;

  if (req.user?.id) {
    await ReadingHistory.findOneAndUpdate(
      { user: req.user.id, post: post._id },
      { viewedAt: new Date() },
      { upsert: true, new: true }
    );
  }

  const userId = req.user?.id?.toString();
  const isLiked = userId ? post.likes.some((id) => id.toString() === userId) : false;

  res.json({ success: true, post: { ...post.toObject(), isLiked, likeCount: post.likes.length } });
});

const getRelatedPosts = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  const posts = await populatePost(
    Post.find({
      _id: { $ne: post._id },
      status: 'published',
      $or: [{ category: post.category }, { tags: { $in: post.tags } }],
    })
      .sort({ views: -1 })
      .limit(4)
  );

  res.json({ success: true, posts });
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  if (post.author.toString() !== req.user.id.toString()) {
    throw new AppError('Forbidden: only author can update post', 403);
  }

  const { title, content, tags, category, status, excerpt } = req.body;
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (tags !== undefined) post.tags = tags;
  if (category !== undefined) post.category = category;
  if (status !== undefined) post.status = status;
  if (excerpt !== undefined) post.excerpt = excerpt;

  await post.save();
  const populated = await populatePost(Post.findById(post._id));
  res.json({ success: true, post: populated });
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  if (post.author.toString() !== req.user.id.toString()) {
    throw new AppError('Forbidden: only author can delete post', 403);
  }

  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ success: true, message: 'Post deleted successfully' });
});

const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  const userId = req.user.id.toString();
  if (post.likes.some((id) => id.toString() === userId)) {
    throw new AppError('Post already liked', 400);
  }

  post.likes.push(req.user.id);
  await post.save();
  res.json({ success: true, likeCount: post.likes.length, isLiked: true });
});

const unlikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  const userId = req.user.id.toString();
  const hadLike = post.likes.some((id) => id.toString() === userId);
  post.likes = post.likes.filter((id) => id.toString() !== userId);
  await post.save();

  res.json({ success: true, likeCount: post.likes.length, isLiked: false, removed: hadLike });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Post.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  res.json({ success: true, categories });
});

module.exports = {
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
};
