const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const { blogUpload } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:slug', blogController.getBlogBySlug);

// Admin routes
router.get('/admin/all', authMiddleware, blogController.getAllBlogsAdmin);
router.get('/admin/:id', authMiddleware, blogController.getBlogById);
router.post('/', authMiddleware, blogUpload.single('featuredImage'), blogController.createBlog);
router.put('/:id', authMiddleware, blogUpload.single('featuredImage'), blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;