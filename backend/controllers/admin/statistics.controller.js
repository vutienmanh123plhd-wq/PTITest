const { pool } = require('../../config/database');
const PDFDocument = require('pdfkit');
const xlsx = require('xlsx');

class AdminStatisticsController {
  static async getDashboardStatistics(req, res, next) {
    try {
      // Total users
      const [userCount] = await pool.query(
        'SELECT COUNT(*) as count FROM users WHERE role = ?',
        ['student']
      );

      // Total exams
      const [examCount] = await pool.query('SELECT COUNT(*) as count FROM exams');

      // Total submissions
      const [submissionCount] = await pool.query('SELECT COUNT(*) as count FROM results');

      // Average score
      const [avgScore] = await pool.query('SELECT AVG(score) as avg_score FROM results');

      // Recent submissions
      const [recentSubmissions] = await pool.query(
        `SELECT u.id as user_id, u.username, e.name as exam_name, r.score, r.submitted_at
         FROM results r
         JOIN users u ON r.user_id = u.id
         JOIN exams e ON r.exam_id = e.id
         ORDER BY r.submitted_at DESC
         LIMIT 10`
      );

      res.status(200).json({
        success: true,
        data: {
          total_users: userCount[0].count,
          total_exams: examCount[0].count,
          total_submissions: submissionCount[0].count,
          average_score: avgScore[0].avg_score ? parseFloat(avgScore[0].avg_score.toFixed(2)) : 0,
          recent_submissions: recentSubmissions
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getComprehensiveStatistics(req, res, next) {
    try {
      const { exam_id, date_from, date_to } = req.query;

      let query = `
        SELECT r.score FROM results r
        WHERE 1=1
      `;
      const params = [];

      if (exam_id) {
        query += ' AND r.exam_id = ?';
        params.push(exam_id);
      }

      if (date_from) {
        query += ' AND DATE(r.submitted_at) >= ?';
        params.push(date_from);
      }

      if (date_to) {
        query += ' AND DATE(r.submitted_at) <= ?';
        params.push(date_to);
      }

      const [results] = await pool.query(query, params);

      // Calculate statistics
      const total = results.length;
      const scores = results.map(r => r.score);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0;
      const completionRate = total > 0 ? 100 : 0;

      // Score distribution
      const distribution = {
        '0-20': scores.filter(s => s < 20).length,
        '21-40': scores.filter(s => s >= 20 && s < 40).length,
        '41-60': scores.filter(s => s >= 40 && s < 60).length,
        '61-80': scores.filter(s => s >= 60 && s < 80).length,
        '81-100': scores.filter(s => s >= 80).length
      };

      // Exam statistics
      const [examStats] = await pool.query(
        `SELECT e.id as exam_id, e.name as exam_name, COUNT(r.id) as total_participants,
                AVG(r.score) as average_score
         FROM exams e
         LEFT JOIN results r ON e.id = r.exam_id
         ${exam_id ? 'WHERE e.id = ?' : ''}
         GROUP BY e.id, e.name`,
        exam_id ? [exam_id] : []
      );

      const examStatistics = examStats.map(stat => ({
        exam_id: stat.exam_id,
        exam_name: stat.exam_name,
        total_participants: stat.total_participants,
        average_score: stat.average_score ? parseFloat(stat.average_score.toFixed(2)) : 0,
        completion_rate: 100
      }));

      res.status(200).json({
        success: true,
        data: {
          total_submissions: total,
          completion_rate: completionRate,
          average_score: parseFloat(avgScore.toFixed(2)),
          score_distribution: distribution,
          exam_statistics: examStatistics
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async exportStatistics(req, res, next) {
    try {
      const { format, exam_id } = req.query;

      let query = `
        SELECT e.name as exam_name, u.username, u.full_name, r.score, 
               r.correct_answers, r.total_questions, r.submitted_at
        FROM results r
        JOIN users u ON r.user_id = u.id
        JOIN exams e ON r.exam_id = e.id
        WHERE 1=1
      `;
      const params = [];

      if (exam_id) {
        query += ' AND e.id = ?';
        params.push(exam_id);
      }

      query += ' ORDER BY r.submitted_at DESC';

      const [data] = await pool.query(query, params);

      if (format === 'excel') {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Statistics');

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="statistics.xlsx"');

        xlsx.write(workbook, { bookType: 'xlsx', type: 'stream' }).pipe(res);
      } else if (format === 'pdf') {
        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="statistics.pdf"');

        doc.pipe(res);
        doc.fontSize(16).text('Exam Statistics Report', { align: 'center' });
        doc.fontSize(10);

        // Table header
        const columns = ['Exam', 'User', 'Full Name', 'Score', 'Correct/Total', 'Date'];
        let y = 100;

        doc.text(columns.join(' | '), 50, y);
        doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
        y += 30;

        // Table data
        data.forEach(row => {
          if (y > 700) {
            doc.addPage();
            y = 50;
          }

          const text = `${row.exam_name} | ${row.username} | ${row.full_name} | ${row.score} | ${row.correct_answers}/${row.total_questions} | ${new Date(row.submitted_at).toLocaleDateString()}`;
          doc.text(text, 50, y);
          y += 20;
        });

        doc.end();
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid format. Use "pdf" or "excel"',
          error_code: 'INVALID_FORMAT'
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminStatisticsController;
