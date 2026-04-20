const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage for blogs
const blogStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blogs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 630, crop: 'fill' }]
  }
});

// Create storage for gallery
const galleryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

// Create upload middleware instances
const uploadGallery = multer({ storage: galleryStorage });
const uploadBlog = multer({ storage: blogStorage });

// For backward compatibility, also export a default upload (gallery)
const upload = uploadGallery;

// Export both upload middleware
module.exports = {
  upload: uploadGallery,
  blogUpload: uploadBlog,
  // For backward compatibility with existing code that expects single function
  single: function(fieldname) {
    return uploadGallery.single(fieldname);
  }
};