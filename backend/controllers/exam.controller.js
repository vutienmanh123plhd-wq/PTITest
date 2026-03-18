const { pool } = require('../config/database');

class ExamController {
  static async getAllExams(req, res, next) {
    try {
      const { search, type, status } = req.query;
      let query = 'SELECT * FROM exams WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND name LIKE ?';
        params.push(`%${search}%`);
      }

      if (type) {
        query += ' AND type = ?';
        params.push(type);
      }

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      query += ' ORDER BY created_at DESC';

      const [exams] = await pool.query(query, params);

      res.status(200).json({
        success: true,
        data: exams
      });
    } catch (error) {
      next(error);
    }
  }

  static async getExamById(req, res, next) {
    try {
      const { id } = req.params;

      // Get exam
      const [exams] = await pool.query(
        'SELECT * FROM exams WHERE id = ?',
        [id]
      );

      if (exams.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Exam not found',
          error_code: 'EXAM_NOT_FOUND'
        });
      }

      const exam = exams[0];

      // Get questions
      const [questions] = await pool.query(
        'SELECT * FROM questions WHERE exam_id = ? ORDER BY question_order ASC',
        [id]
      );

      // Get options for each question
      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const [options] = await pool.query(
            'SELECT id, option_text, option_order FROM options WHERE question_id = ? ORDER BY option_order ASC',
            [question.id]
          );
          return {
            ...question,
            options
          };
        })
      );

      res.status(200).json({
        success: true,
        data: {
          ...exam,
          questions: questionsWithOptions
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async submitExam(req, res, next) {
    try {
      const { id } = req.params;
      const { answers } = req.body;
      const userId = req.user.id;

      // Get exam and questions
      const [exams] = await pool.query('SELECT * FROM exams WHERE id = ?', [id]);
      if (exams.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Exam not found',
          error_code: 'EXAM_NOT_FOUND'
        });
      }

      const exam = exams[0];

      // Calculate score
      let correctCount = 0;
      const answerDetails = [];

      for (const answer of answers) {
        const { question_id, selected_option_id } = answer;

        // Get correct option
        const [options] = await pool.query(
          'SELECT id FROM options WHERE question_id = ? AND is_correct = TRUE',
          [question_id]
        );

        const correctOptionId = options.length > 0 ? options[0].id : null;
        const isCorrect = selected_option_id === correctOptionId;

        if (isCorrect) {
          correctCount++;
        }

        answerDetails.push({
          question_id,
          selected_option_id,
          correct_option_id: correctOptionId,
          is_correct: isCorrect
        });
      }

      const score = (correctCount / exam.total_questions) * 100;

      // Save result
      const [resultData] = await pool.query(
        'INSERT INTO results (user_id, exam_id, score, correct_answers, total_questions) VALUES (?, ?, ?, ?, ?)',
        [userId, id, score.toFixed(2), correctCount, exam.total_questions]
      );

      const resultId = resultData.insertId;

      // Save answers
      for (const answer of answerDetails) {
        await pool.query(
          'INSERT INTO answers (result_id, question_id, selected_option_id, correct_option_id, is_correct) VALUES (?, ?, ?, ?, ?)',
          [resultId, answer.question_id, answer.selected_option_id, answer.correct_option_id, answer.is_correct]
        );
      }

      res.status(200).json({
        success: true,
        data: {
          result_id: resultId,
          score: parseFloat(score.toFixed(2)),
          correct_answers: correctCount,
          total_questions: exam.total_questions
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExamController;
