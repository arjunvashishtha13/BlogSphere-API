const User = require('../models/User');
const Post = require('../models/Post');
const Bookmark = require('../models/Bookmark');
const ReadingHistory = require('../models/ReadingHistory');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) throw new AppError('User not found', 404);

  const [postCount, totalViews, totalLikes] = await Promise.all([
    Post.countDocuments({ author: user._id, status: 'published' }),
    Post.aggregate([
      { $match: { author: user._id } },
      { $group: { _id: null, total: { $sum: '$views' } } },
    ]),
    Post.aggregate([
      { $match: { author: user._id } },
      { $project: { likeCount: { $size: '$likes' } } },
      { $group: { _id: null, total: { $sum: '$likeCount' } } },
    ]),
  ]);

  res.json({
    success: true,
    user: {
      ...user.toObject(),
      stats: {
        postCount,
        totalViews: totalViews[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0,
      },
    },
  });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, bio, avatar, website, github, twitter, linkedin } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) throw new AppError('User not found', 404);
  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;
  if (website !== undefined) user.website = website;
  if (github !== undefined) user.github = github;
  if (twitter !== undefined) user.twitter = twitter;
  if (linkedin !== undefined) user.linkedin = linkedin;

  await user.save();

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      website: user.website,
      github: user.github,
      twitter: user.twitter,
      linkedin: user.linkedin,
      role: user.role,
    },
  });
});

const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    'name bio avatar website github twitter linkedin createdAt'
  );
  if (!user) throw new AppError('User not found', 404);

  const [posts, totalLikes] = await Promise.all([
    Post.find({ author: user._id, status: 'published' })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar')
      .select('-content')
      .lean(),
    Post.aggregate([
      { $match: { author: user._id, status: 'published' } },
      { $project: { likeCount: { $size: '$likes' } } },
      { $group: { _id: null, total: { $sum: '$likeCount' } } },
    ]),
  ]);

  res.json({
    success: true,
    user: {
      ...user.toObject(),
      totalLikes: totalLikes[0]?.total || 0,
      totalPosts: posts.length,
    },
    posts,
  });
});

const getUserPosts = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const filter = { author: req.user.id };
  if (status) filter.status = status;

  const posts = await Post.find(filter)
    .sort({ updatedAt: -1 })
    .populate('author', 'name avatar')
    .lean();

  res.json({ success: true, posts });
});

const toggleBookmark = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw new AppError('Post not found', 404);

  const existing = await Bookmark.findOne({ user: req.user.id, post: post._id });

  if (existing) {
    await existing.deleteOne();
    return res.json({ success: true, bookmarked: false });
  }

  await Bookmark.create({ user: req.user.id, post: post._id });
  res.json({ success: true, bookmarked: true });
});

const getBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate({
      path: 'post',
      populate: { path: 'author', select: 'name avatar' },
    });

  res.json({
    success: true,
    bookmarks: bookmarks.map((b) => b.post).filter(Boolean),
  });
});

const getReadingHistory = asyncHandler(async (req, res) => {
  const history = await ReadingHistory.find({ user: req.user.id })
    .sort({ viewedAt: -1 })
    .limit(20)
    .populate({
      path: 'post',
      populate: { path: 'author', select: 'name avatar' },
    });

  res.json({
    success: true,
    history: history.map((h) => h.post).filter(Boolean),
  });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const authorId = req.user.id;

  const [posts, topPosts, recentPosts] = await Promise.all([
    Post.find({ author: authorId }),
    Post.find({ author: authorId, status: 'published' })
      .sort({ views: -1 })
      .limit(5)
      .select('title views likes createdAt readingTime'),
    Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status views createdAt'),
  ]);

  const published = posts.filter((p) => p.status === 'published');
  const drafts = posts.filter((p) => p.status === 'draft');

  const stats = {
    totalPosts: published.length,
    totalDrafts: drafts.length,
    totalViews: published.reduce((sum, p) => sum + p.views, 0),
    totalLikes: published.reduce((sum, p) => sum + p.likes.length, 0),
    avgReadingTime:
      published.length > 0
        ? Math.round(published.reduce((sum, p) => sum + p.readingTime, 0) / published.length)
        : 0,
  };

  res.json({
    success: true,
    stats,
    topPosts: topPosts.map((p) => ({
      ...p.toObject(),
      likeCount: p.likes.length,
    })),
    recentPosts,
  });
});

const getRecommendations = asyncHandler(async (req, res) => {
  const history = await ReadingHistory.find({ user: req.user.id })
    .populate('post')
    .limit(10);

  const categories = [...new Set(history.map((h) => h.post?.category).filter(Boolean))];
  const readIds = history.map((h) => h.post?._id).filter(Boolean);

  const filter = {
    status: 'published',
    _id: { $nin: readIds },
  };

  if (categories.length > 0) {
    filter.category = { $in: categories };
  }

  const posts = await Post.find(filter)
    .sort({ views: -1 })
    .limit(6)
    .populate('author', 'name avatar')
    .lean();

  res.json({ success: true, posts });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getPublicProfile,
  getUserPosts,
  toggleBookmark,
  getBookmarks,
  getReadingHistory,
  getAnalytics,
  getRecommendations,
};
