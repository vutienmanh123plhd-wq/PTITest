const express = require('express');
const router = express.Router();
const AdminResultController = require('../../controllers/admin/result.controller');
const { authMiddleware, adminMiddleware } = require('../../middleware/auth');

router.get('/', authMiddleware, adminMiddleware, AdminResultController.getAllResults);
router.get('/student/:userId', authMiddleware, adminMiddleware, AdminResultController.getStudentResults);
router.get('/detail/:resultId', authMiddleware, adminMiddleware, AdminResultController.getResultDetails);
router.get('/export/:resultId', authMiddleware, adminMiddleware, AdminResultController.exportResultPDF);

module.exports = router;
