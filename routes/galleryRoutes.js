const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', galleryController.getAllImages);
router.get('/:id', galleryController.getImageById);

// Admin routes
router.post('/', authMiddleware, upload.single('image'), galleryController.createImage);
router.put('/:id', authMiddleware, upload.single('image'), galleryController.updateImage);
router.delete('/:id', authMiddleware, galleryController.deleteImage);

module.exports = router;