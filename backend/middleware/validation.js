const Joi = require('joi');

const validationSchemas = {
  // Auth Schemas
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
    full_name: Joi.string().max(100).required()
  }),

  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),

  // Exam Schemas
  createExam: Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string(),
    type: Joi.string().valid('practice', 'midterm', 'final').required(),
    status: Joi.string().valid('available', 'scheduled', 'closed').required(),
    duration: Joi.number().min(1).required(),
    start_time: Joi.date().allow(null),
    end_time: Joi.date().allow(null),
    total_questions: Joi.number().min(1).required(),
    questions: Joi.array().items(
      Joi.object({
        question: Joi.string().required(),
        options: Joi.array().items(
          Joi.object({
            option_text: Joi.string().required(),
            is_correct: Joi.boolean().required()
          })
        ).min(2).required()
      })
    )
  }),

  updateExam: Joi.object({
    name: Joi.string().max(255),
    description: Joi.string(),
    type: Joi.string().valid('practice', 'midterm', 'final'),
    status: Joi.string().valid('available', 'scheduled', 'closed'),
    duration: Joi.number().min(1),
    start_time: Joi.date().allow(null),
    end_time: Joi.date().allow(null)
  }),

  submitExam: Joi.object({
    answers: Joi.array().items(
      Joi.object({
        question_id: Joi.number().required(),
        selected_option_id: Joi.number().allow(null)
      })
    ).required()
  }),

  // User Schemas
  createUser: Joi.object({
    username: Joi.string().alphanum().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    full_name: Joi.string().max(100).required()
  }),

  updateUser: Joi.object({
    username: Joi.string().alphanum().min(3).max(100),
    email: Joi.string().email(),
    full_name: Joi.string().max(100),
    password: Joi.string().min(6)
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error_code: 'VALIDATION_ERROR',
        details
      });
    }

    req.body = value;
    next();
  };
};

module.exports = {
  validationSchemas,
  validate
};
