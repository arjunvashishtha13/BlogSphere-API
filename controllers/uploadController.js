const cloudinary = require('../config/cloudinary');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No image file provided', 400);
  }

  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new AppError('Image upload service is not configured', 503);
  }

  const b64 = Buffer.from(req.file.buffer).toString('base64');
  let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
  
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'blogsphere',
    resource_type: 'image',
    transformation: [
      { width: 1200, height: 630, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
    ],
  });

  res.json({
    success: true,
    url: result.secure_url,
    public_id: result.public_id,
  });
});

module.exports = { uploadImage };
