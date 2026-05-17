const Comment = require('../models/comment');

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const author = req.user?.id || req.user?.userId;
    const { postId } = req.params;

    if (!author) {
      return res.status(401).json({ message: 'Unauthorized: user not found in request' });
    }

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = new Comment({
      text,
      author,
      post: postId,
    });

    const savedComment = await comment.save();
    const populatedComment = await savedComment.populate('author', 'name');
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('addComment error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('getCommentsByPost error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const author = req.user?.id || req.user?.userId;
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (!author || comment.author.toString() !== author.toString()) {
      return res.status(403).json({ message: 'Forbidden: only comment author can delete comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('deleteComment error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addComment,
  getCommentsByPost,
  deleteComment,
};
