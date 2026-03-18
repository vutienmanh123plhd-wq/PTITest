const express = require('express');
const router = express.Router();
const multer = require('multer');
const AdminExamController = require('../../controllers/admin/exam.controller');
const { authMiddleware, adminMiddleware } = require('../../middleware/auth');
const { validate, validationSchemas } = require('../../middleware/validation');

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authMiddleware, adminMiddleware, validate(validationSchemas.createExam), AdminExamController.createExam);
router.put('/:id', authMiddleware, adminMiddleware, validate(validationSchemas.updateExam), AdminExamController.updateExam);
router.delete('/:id', authMiddleware, adminMiddleware, AdminExamController.deleteExam);
router.post('/:id/import', authMiddleware, adminMiddleware, upload.single('file'), AdminExamController.importExamFromFile);

module.exports = router;
