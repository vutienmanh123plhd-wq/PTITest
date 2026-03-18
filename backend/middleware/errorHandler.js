const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // Validation Error
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error_code: 'VALIDATION_ERROR',
      details: error.details || error.message
    });
  }

  // Database Error
  if (error.code && error.code.startsWith('ER_')) {
    return res.status(400).json({
      success: false,
      message: 'Database error',
      error_code: 'DB_ERROR',
      data: null
    });
  }

  // JWT Error
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error_code: 'INVALID_TOKEN'
    });
  }

  // Generic Error
  return res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    error_code: error.error_code || 'SERVER_ERROR'
  });
};

module.exports = errorHandler;
