const { pool } = require('../../config/database');
const PDFDocument = require('pdfkit');

class AdminResultController {
  static async getAllResults(req, res, next) {
    try {
      const { search, exam_id, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT r.id, r.user_id, u.username, u.full_name, r.exam_id, e.name as exam_name,
               r.score, r.correct_answers, r.total_questions, r.submitted_at
        FROM results r
        JOIN users u ON r.user_id = u.id
        JOIN exams e ON r.exam_id = e.id
        WHERE 1=1
      `;
      let countQuery = `
        SELECT COUNT(*) as count
        FROM results r
        JOIN users u ON r.user_id = u.id
        JOIN exams e ON r.exam_id = e.id
        WHERE 1=1
      `;
      const params = [];

      if (search) {
        query += ' AND (u.username LIKE ? OR u.full_name LIKE ?)';
        countQuery += ' AND (u.username LIKE ? OR u.full_name LIKE ?)';
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam);
      }

      if (exam_id) {
        query += ' AND r.exam_id = ?';
        countQuery += ' AND r.exam_id = ?';
        params.push(exam_id);
      }

      query += ' ORDER BY r.submitted_at DESC LIMIT ? OFFSET ?';
      const countParams = [...params];
      params.push(parseInt(limit), offset);

      const [results] = await pool.query(query, params);
      const [countResult] = await pool.query(countQuery, countParams);
      const total = countResult[0].count;

      res.status(200).json({
        success: true,
        data: results,
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

  static async getStudentResults(req, res, next) {
    try {
      const { userId } = req.params;

      // Get student info
      const [users] = await pool.query(
        'SELECT id, username, full_name, email FROM users WHERE id = ? AND role = ?',
        [userId, 'student']
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Student not found',
          error_code: 'STUDENT_NOT_FOUND'
        });
      }

      const student = users[0];

      // Get student results
      const [results] = await pool.query(
        `SELECT r.id, r.exam_id, e.name as exam_name, r.score, r.correct_answers,
                r.total_questions, r.submitted_at
         FROM results r
         JOIN exams e ON r.exam_id = e.id
         WHERE r.user_id = ?
         ORDER BY r.submitted_at DESC`,
        [userId]
      );

      res.status(200).json({
        success: true,
        data: {
          user_id: student.id,
          username: student.username,
          full_name: student.full_name,
          email: student.email,
          results
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getResultDetails(req, res, next) {
    try {
      const { resultId } = req.params;

      // Get result
      const [results] = await pool.query(
        `SELECT r.*, e.name as exam_name FROM results r
         JOIN exams e ON r.exam_id = e.id
         WHERE r.id = ?`,
        [resultId]
      );

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Result not found',
          error_code: 'RESULT_NOT_FOUND'
        });
      }

      const result = results[0];

      // Get answers with details
      const [answers] = await pool.query(
        `SELECT a.*, q.question,
                so.option_text as selected_option_text,
                co.option_text as correct_option_text
         FROM answers a
         JOIN questions q ON a.question_id = q.id
         LEFT JOIN options so ON a.selected_option_id = so.id
         LEFT JOIN options co ON a.correct_option_id = co.id
         WHERE a.result_id = ?`,
        [resultId]
      );

      res.status(200).json({
        success: true,
        data: {
          id: result.id,
          exam_id: result.exam_id,
          exam_name: result.exam_name,
          score: result.score,
          correct_answers: result.correct_answers,
          total_questions: result.total_questions,
          submitted_at: result.submitted_at,
          answers: answers.map(answer => ({
            id: answer.id,
            question_id: answer.question_id,
            question_text: answer.question,
            selected_option_id: answer.selected_option_id,
            selected_option_text: answer.selected_option_text,
            correct_option_id: answer.correct_option_id,
            correct_option_text: answer.correct_option_text,
            is_correct: answer.is_correct
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async exportResultPDF(req, res, next) {
    try {
      const { resultId } = req.params;

      // Get result details
      const [results] = await pool.query(
        `SELECT r.*, u.username, u.full_name, e.name as exam_name
         FROM results r
         JOIN users u ON r.user_id = u.id
         JOIN exams e ON r.exam_id = e.id
         WHERE r.id = ?`,
        [resultId]
      );

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Result not found',
          error_code: 'RESULT_NOT_FOUND'
        });
      }

      const result = results[0];

      // Get answers
      const [answers] = await pool.query(
        `SELECT a.*, q.question,
                so.option_text as selected_option_text,
                co.option_text as correct_option_text
         FROM answers a
         JOIN questions q ON a.question_id = q.id
         LEFT JOIN options so ON a.selected_option_id = so.id
         LEFT JOIN options co ON a.correct_option_id = co.id
         WHERE a.result_id = ?`,
        [resultId]
      );

      // Create PDF
      const doc = new PDFDocument();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="result_${resultId}.pdf"`);

      doc.pipe(res);

      // Header
      doc.fontSize(20).text('Exam Result Report', { align: 'center' });
      doc.fontSize(10).moveDown();

      // Student Info
      doc.text(`Student: ${result.full_name} (${result.username})`);
      doc.text(`Exam: ${result.exam_name}`);
      doc.text(`Date: ${new Date(result.submitted_at).toLocaleDateString()}`);
      doc.moveDown();

      // Score Summary
      doc.fontSize(12).text('Summary');
      doc.fontSize(10);
      doc.text(`Score: ${result.score}/100`);
      doc.text(`Correct Answers: ${result.correct_answers}/${result.total_questions}`);
      doc.moveDown();

      // Answers
      doc.fontSize(12).text('Questions and Answers');
      doc.fontSize(9);

      answers.forEach((answer, index) => {
        if (doc.y > 700) {
          doc.addPage();
        }

        doc.text(`Q${index + 1}: ${answer.question}`);
        doc.text(`Your Answer: ${answer.selected_option_text || 'No answer'}`);
        doc.text(`Correct Answer: ${answer.correct_option_text}`);
        doc.text(`Status: ${answer.is_correct ? 'CORRECT' : 'INCORRECT'}`, 
          { color: answer.is_correct ? 'green' : 'red' });
        doc.moveDown();
      });

      doc.end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminResultController;
