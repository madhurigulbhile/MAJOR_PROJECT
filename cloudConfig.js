const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true // ✅ ensures HTTPS URLs
});

// Multer storage setup for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowed_formats: ["png", "jpg", "jpeg"],
        public_id: (req, file) => `${Date.now()}-${file.originalname}` // ✅ unique filenames
    },
});

module.exports = {
    cloudinary,
    storage,
};
