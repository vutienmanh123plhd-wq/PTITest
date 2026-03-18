const express = require('express');
const router = express.Router();
const ResultController = require('../controllers/result.controller');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, ResultController.getUserResults);
router.get('/:resultId', authMiddleware, ResultController.getResultDetails);

module.exports = router;
