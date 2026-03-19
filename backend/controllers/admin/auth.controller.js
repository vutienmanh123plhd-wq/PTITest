const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../../config/database');

class AdminAuthController {
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // Get admin user
      const [users] = await pool.query(
        'SELECT id, username, email, password, role FROM users WHERE username = ? AND role = ?',
        [username, 'admin']
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password',
          error_code: 'INVALID_CREDENTIALS'
        });
      }

      const user = users[0];

      // Compare password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password',
          error_code: 'INVALID_CREDENTIALS'
        });
      }

      // Generate token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.ADMIN_JWT_EXPIRATION || '7d' }
      );

      res.status(200).json({
        success: true,
        token,
        admin: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminAuthController;
