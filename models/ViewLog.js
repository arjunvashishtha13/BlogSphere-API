const mongoose = require('mongoose');

const viewLogSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // TTL: auto-delete after 24 hours
  },
});

viewLogSchema.index({ post: 1, ip: 1 }, { unique: true });

module.exports = mongoose.model('ViewLog', viewLogSchema);
