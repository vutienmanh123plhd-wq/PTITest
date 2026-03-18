const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { validate, validationSchemas } = require('../middleware/validation');

router.post('/register', validate(validationSchemas.register), AuthController.register);
router.post('/login', validate(validationSchemas.login), AuthController.login);
router.post('/logout', AuthController.logout);

module.exports = router;
