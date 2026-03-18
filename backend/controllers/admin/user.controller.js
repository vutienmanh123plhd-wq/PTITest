const bcrypt = require('bcryptjs');
const { pool } = require('../../config/database');

class AdminUserController {
  static async getAllUsers(req, res, next) {
    try {
      const { search, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      let query = 'SELECT id, username, email, full_name, role, created_at FROM users WHERE role = ?';
      let countQuery = 'SELECT COUNT(*) as count FROM users WHERE role = ?';
      const params = ['student'];

      if (search) {
        query += ` AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)`;
        countQuery += ` AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)`;
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);

      const [users] = await pool.query(query, params);

      // Get total count
      const countParams = search ? ['student', `%${search}%`, `%${search}%`, `%${search}%`] : ['student'];
      const [countResult] = await pool.query(countQuery, countParams);
      const total = countResult[0].count;

      res.status(200).json({
        success: true,
        data: users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      const { username, email, password, full_name } = req.body;

      // Check if user exists
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
        data: {
          id: result.insertId,
          username,
          email,
          full_name,
          role: 'student'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { username, email, full_name, password } = req.body;

      // Check if user exists
      const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          error_code: 'USER_NOT_FOUND'
        });
      }

      const updateFields = [];
      const updateValues = [];

      if (username) updateFields.push('username = ?'), updateValues.push(username);
      if (email) updateFields.push('email = ?'), updateValues.push(email);
      if (full_name) updateFields.push('full_name = ?'), updateValues.push(full_name);
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.push('password = ?');
        updateValues.push(hashedPassword);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update',
          error_code: 'NO_UPDATE_FIELDS'
        });
      }

      updateValues.push(id);
      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      await pool.query(query, updateValues);

      // Get updated user
      const [updatedUsers] = await pool.query(
        'SELECT id, username, email, full_name, role FROM users WHERE id = ?',
        [id]
      );

      res.status(200).json({
        success: true,
        data: updatedUsers[0]
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // Check if user exists
      const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          error_code: 'USER_NOT_FOUND'
        });
      }

      // Delete user
      await pool.query('DELETE FROM users WHERE id = ?', [id]);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminUserController;
