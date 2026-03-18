const { pool, initializeDatabase } = require('./config/database');

async function main() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialized successfully!');

    // Create default admin account
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Check if admin exists
    const [existingAdmin] = await pool.query(
      'SELECT id FROM users WHERE username = ? AND role = ?',
      ['admin', 'admin']
    );

    if (existingAdmin.length === 0) {
      await pool.query(
        'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
        ['admin', 'admin@pti.edu.vn', hashedPassword, 'Administrator', 'admin']
      );
      console.log('Default admin account created (username: admin, password: admin123)');
    } else {
      console.log('Admin account already exists');
    }

    // Create sample data (optional)
    const [exams] = await pool.query('SELECT id FROM exams LIMIT 1');
    
    if (exams.length === 0) {
      console.log('Creating sample exam...');

      // Create sample exam
      const [examResult] = await pool.query(
        'INSERT INTO exams (name, description, type, status, duration, total_questions) VALUES (?, ?, ?, ?, ?, ?)',
        ['Sample Exam', 'This is a sample exam for demonstration', 'practice', 'available', 60, 2]
      );

      const examId = examResult.insertId;

      // Create sample questions
      const questions = [
        {
          question: 'What is the capital of France?',
          options: [
            { text: 'London', correct: false },
            { text: 'Paris', correct: true },
            { text: 'Berlin', correct: false },
            { text: 'Madrid', correct: false }
          ]
        },
        {
          question: 'What is 2 + 2?',
          options: [
            { text: '3', correct: false },
            { text: '4', correct: true },
            { text: '5', correct: false },
            { text: '6', correct: false }
          ]
        }
      ];

      for (let i = 0; i < questions.length; i++) {
        const [questionResult] = await pool.query(
          'INSERT INTO questions (exam_id, question, question_order) VALUES (?, ?, ?)',
          [examId, questions[i].question, i + 1]
        );

        const questionId = questionResult.insertId;

        for (let j = 0; j < questions[i].options.length; j++) {
          await pool.query(
            'INSERT INTO options (question_id, option_text, option_order, is_correct) VALUES (?, ?, ?, ?)',
            [questionId, questions[i].options[j].text, j + 1, questions[i].options[j].correct]
          );
        }
      }

      console.log('Sample exam created');
    }

    console.log('Database setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
