const express = require('express');
const router = express.Router();
const ExamController = require('../controllers/exam.controller');
const { authMiddleware } = require('../middleware/auth');
const { validate, validationSchemas } = require('../middleware/validation');

router.get('/', ExamController.getAllExams);
router.get('/:id', ExamController.getExamById);
router.post('/:id/submit', authMiddleware, validate(validationSchemas.submitExam), ExamController.submitExam);

module.exports = router;
