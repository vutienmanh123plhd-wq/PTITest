const { pool } = require('../../config/database');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

class AdminExamController {
  static async createExam(req, res, next) {
    try {
      const { name, description, type, status, duration, start_time, end_time, questions } = req.body;

      // Create exam
      const [examResult] = await pool.query(
        'INSERT INTO exams (name, description, type, status, duration, start_time, end_time, total_questions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, description, type, status, duration, start_time || null, end_time || null, questions.length]
      );

      const examId = examResult.insertId;

      // Create questions and options
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        const [questionResult] = await pool.query(
          'INSERT INTO questions (exam_id, question, question_order) VALUES (?, ?, ?)',
          [examId, question.question, i + 1]
        );

        const questionId = questionResult.insertId;

        // Create options
        for (let j = 0; j < question.options.length; j++) {
          const option = question.options[j];

          await pool.query(
            'INSERT INTO options (question_id, option_text, option_order, is_correct) VALUES (?, ?, ?, ?)',
            [questionId, option.option_text, j + 1, option.is_correct]
          );
        }
      }

      res.status(201).json({
        success: true,
        data: {
          id: examId,
          name,
          description,
          type,
          status,
          duration,
          total_questions: questions.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateExam(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, type, status, duration, start_time, end_time } = req.body;

      // Check if exam exists
      const [exams] = await pool.query('SELECT * FROM exams WHERE id = ?', [id]);
      if (exams.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Exam not found',
          error_code: 'EXAM_NOT_FOUND'
        });
      }

      const updateFields = [];
      const updateValues = [];

      if (name) updateFields.push('name = ?'), updateValues.push(name);
      if (description) updateFields.push('description = ?'), updateValues.push(description);
      if (type) updateFields.push('type = ?'), updateValues.push(type);
      if (status) updateFields.push('status = ?'), updateValues.push(status);
      if (duration) updateFields.push('duration = ?'), updateValues.push(duration);
      if (start_time !== undefined) updateFields.push('start_time = ?'), updateValues.push(start_time);
      if (end_time !== undefined) updateFields.push('end_time = ?'), updateValues.push(end_time);

      if (updateFields.length > 0) {
        updateValues.push(id);
        const query = `UPDATE exams SET ${updateFields.join(', ')} WHERE id = ?`;
        await pool.query(query, updateValues);
      }

      // Get updated exam
      const [updatedExams] = await pool.query('SELECT * FROM exams WHERE id = ?', [id]);

      res.status(200).json({
        success: true,
        data: updatedExams[0]
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteExam(req, res, next) {
    try {
      const { id } = req.params;

      // Check if exam exists
      const [exams] = await pool.query('SELECT id FROM exams WHERE id = ?', [id]);
      if (exams.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Exam not found',
          error_code: 'EXAM_NOT_FOUND'
        });
      }

      // Delete exam (cascade delete will handle questions, options, etc.)
      await pool.query('DELETE FROM exams WHERE id = ?', [id]);

      res.status(200).json({
        success: true,
        message: 'Exam deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async importExamFromFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
          error_code: 'NO_FILE'
        });
      }

      const { name, description, type, status, duration } = req.body;
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON: expected format - Column A: Question, B-E: Options, F: Correct Answer (1-4)
      const rows = xlsx.utils.sheet_to_json(worksheet);

      if (!rows || rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No data found in Excel file',
          error_code: 'EMPTY_FILE'
        });
      }

      const questions = [];
      for (const row of rows) {
        const question = {
          question: row['Question'] || row['Câu hỏi'] || '',
          options: [
            { option_text: row['Option A'] || row['Đáp án A'] || '', is_correct: false },
            { option_text: row['Option B'] || row['Đáp án B'] || '', is_correct: false },
            { option_text: row['Option C'] || row['Đáp án C'] || '', is_correct: false },
            { option_text: row['Option D'] || row['Đáp án D'] || '', is_correct: false }
          ]
        };

        // Mark correct answer
        const correctAnswer = row['Correct'] || row['Đáp án đúng'] || '';
        if (correctAnswer && ['A', 'B', 'C', 'D'].includes(String(correctAnswer).toUpperCase())) {
          const index = String(correctAnswer).toUpperCase().charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
          question.options[index].is_correct = true;
        }

        if (question.question && question.options.some(o => o.option_text)) {
          questions.push(question);
        }
      }

      if (questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid questions found in file',
          error_code: 'NO_VALID_QUESTIONS'
        });
      }

      // Create exam with questions
      const [examResult] = await pool.query(
        'INSERT INTO exams (name, description, type, status, duration, total_questions) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, type, status, duration, questions.length]
      );

      const examId = examResult.insertId;

      // Create questions and options
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        const [questionResult] = await pool.query(
          'INSERT INTO questions (exam_id, question, question_order) VALUES (?, ?, ?)',
          [examId, question.question, i + 1]
        );

        const questionId = questionResult.insertId;

        for (let j = 0; j < question.options.length; j++) {
          const option = question.options[j];

          if (option.option_text) {
            await pool.query(
              'INSERT INTO options (question_id, option_text, option_order, is_correct) VALUES (?, ?, ?, ?)',
              [questionId, option.option_text, j + 1, option.is_correct]
            );
          }
        }
      }

      // Clean up uploaded file
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }

      res.status(201).json({
        success: true,
        data: {
          id: examId,
          name,
          description,
          type,
          status,
          duration,
          total_questions: questions.length
        }
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      next(error);
    }
  }
}

module.exports = AdminExamController;
