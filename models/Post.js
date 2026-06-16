const mongoose = require('mongoose');
const { calculateReadingTime, generateExcerpt } = require('../utils/readingTime');

const CATEGORIES = [
  'Technology',
  'Design',
  'Business',
  'Lifestyle',
  'Science',
  'Culture',
  'Tutorial',
  'Opinion',
];

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      default: '',
      maxlength: 300,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: 'Technology',
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ author: 1, status: 1, createdAt: -1 });
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ status: 1, views: -1 });
postSchema.index({ status: 1, category: 1 });
postSchema.index({ tags: 1 });

postSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    this.readingTime = calculateReadingTime(this.content);
    if (!this.excerpt) {
      this.excerpt = generateExcerpt(this.content);
    }
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
module.exports.CATEGORIES = CATEGORIES;
