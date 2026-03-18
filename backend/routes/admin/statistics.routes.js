const express = require('express');
const router = express.Router();
const AdminStatisticsController = require('../../controllers/admin/statistics.controller');
const { authMiddleware, adminMiddleware } = require('../../middleware/auth');

router.get('/dashboard', authMiddleware, adminMiddleware, AdminStatisticsController.getDashboardStatistics);
router.get('/comprehensive', authMiddleware, adminMiddleware, AdminStatisticsController.getComprehensiveStatistics);
router.get('/export', authMiddleware, adminMiddleware, AdminStatisticsController.exportStatistics);

module.exports = router;
