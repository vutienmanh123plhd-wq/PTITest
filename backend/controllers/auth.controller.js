const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

class AuthController {
  static async register(req, res, next) {
    try {
      const { username, email, password, full_name } = req.body;

      // Check if user already exists
      const [existingUser] = await pool.query(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists',
          error_code: 'USER_EXISTS'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const [result] = await pool.query(
        'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, full_name, 'student']
      );

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: result.insertId,
          username,
          email,
          role: 'student'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // Get user
      const [users] = await pool.query(
        'SELECT id, username, email, password, role FROM users WHERE username = ? AND role = ?',
        [username, 'student']
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
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      res.status(200).json({
        success: true,
        token,
        user: {
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
      // Since we're using JWT, logout is handled on the client side
      // We can optionally implement token blacklist here
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
