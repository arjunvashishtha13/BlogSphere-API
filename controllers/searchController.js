const Post = require('../models/Post');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const searchSuggestions = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim();
  if (!q || q.length < 2) {
    return res.json({ success: true, suggestions: [] });
  }

  const regex = new RegExp(q, 'i');

  const [posts, authors] = await Promise.all([
    Post.find({ status: 'published', title: regex })
      .select('title category')
      .limit(5)
      .lean(),
    User.find({ name: regex })
      .select('name avatar')
      .limit(3)
      .lean(),
  ]);

  const suggestions = [
    ...posts.map((p) => ({ type: 'post', id: p._id, text: p.title, category: p.category })),
    ...authors.map((a) => ({ type: 'author', id: a._id, text: a.name, avatar: a.avatar })),
  ];

  res.json({ success: true, suggestions });
});

module.exports = { searchSuggestions };
