const { pool } = require('../config/database');

class ResultController {
  static async getUserResults(req, res, next) {
    try {
      const userId = req.user.id;
      const { exam_id } = req.query;

      let query = `
        SELECT r.id, r.user_id, r.exam_id, e.name as exam_name, r.score,
               r.correct_answers, r.total_questions, r.submitted_at
        FROM results r
        JOIN exams e ON r.exam_id = e.id
        WHERE r.user_id = ?
      `;
      const params = [userId];

      if (exam_id) {
        query += ' AND r.exam_id = ?';
        params.push(exam_id);
      }

      query += ' ORDER BY r.submitted_at DESC';

      const [results] = await pool.query(query, params);

      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  static async getResultDetails(req, res, next) {
    try {
      const { resultId } = req.params;
      const userId = req.user.id;

      // Get result
      const [results] = await pool.query(
        `SELECT r.*, e.name as exam_name FROM results r
         JOIN exams e ON r.exam_id = e.id
         WHERE r.id = ? AND r.user_id = ?`,
        [resultId, userId]
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
}

module.exports = ResultController;
