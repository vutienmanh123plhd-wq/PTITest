const express = require('express');
const router = express.Router();
const AdminUserController = require('../../controllers/admin/user.controller');
const { authMiddleware, adminMiddleware } = require('../../middleware/auth');
const { validate, validationSchemas } = require('../../middleware/validation');

router.get('/', authMiddleware, adminMiddleware, AdminUserController.getAllUsers);
router.post('/', authMiddleware, adminMiddleware, validate(validationSchemas.createUser), AdminUserController.createUser);
router.put('/:id', authMiddleware, adminMiddleware, validate(validationSchemas.updateUser), AdminUserController.updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, AdminUserController.deleteUser);

module.exports = router;
