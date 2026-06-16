const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

router.post('/', authMiddleware, uploadLimiter, upload.single('image'), uploadImage);

module.exports = router;
