const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const examRoutes = require('./routes/exam.routes');
const resultRoutes = require('./routes/result.routes');
const adminAuthRoutes = require('./routes/admin/auth.routes');
const adminUserRoutes = require('./routes/admin/user.routes');
const adminExamRoutes = require('./routes/admin/exam.routes');
const adminStatisticsRoutes = require('./routes/admin/statistics.routes');
const adminResultRoutes = require('./routes/admin/result.routes');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging Middleware
app.use(morgan('combined'));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/exams', adminExamRoutes);
app.use('/api/admin/statistics', adminStatisticsRoutes);
app.use('/api/admin/results', adminResultRoutes);

// 404 Handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    error_code: 'NOT_FOUND'
  });
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
