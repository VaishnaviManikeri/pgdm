const express = require('express');
const router = express.Router();
const { login, verifyToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', login);
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;