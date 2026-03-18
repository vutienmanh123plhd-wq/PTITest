const express = require('express');
const router = express.Router();
const AdminAuthController = require('../../controllers/admin/auth.controller');
const { validate, validationSchemas } = require('../../middleware/validation');

router.post('/login', validate(validationSchemas.login), AdminAuthController.login);
router.post('/logout', AdminAuthController.logout);

module.exports = router;
