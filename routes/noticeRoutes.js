const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', noticeController.getAllNotices);
router.get('/:id', noticeController.getNoticeById);

// Admin routes
router.post('/', authMiddleware, noticeController.createNotice);
router.put('/:id', authMiddleware, noticeController.updateNotice);
router.delete('/:id', authMiddleware, noticeController.deleteNotice);

module.exports = router;