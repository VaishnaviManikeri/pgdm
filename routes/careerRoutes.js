const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', careerController.getAllCareers);
router.get('/active', careerController.getActiveCareers);
router.get('/:id', careerController.getCareerById);

// Admin routes
router.post('/', authMiddleware, careerController.createCareer);
router.put('/:id', authMiddleware, careerController.updateCareer);
router.delete('/:id', authMiddleware, careerController.deleteCareer);

module.exports = router;