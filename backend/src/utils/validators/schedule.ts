import Joi from 'joi';

export const createScheduleSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title cannot be empty',
  }),
  startDate: Joi.date().iso().required().messages({
    'date.base': 'Invalid date format',
    'any.required': 'Start date is required',
  }),
  startTime: Joi.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .required()
    .messages({
      'string.pattern.base': 'Start time must be in HH:MM:SS format',
      'any.required': 'Start time is required',
    }),
  duration: Joi.number().min(1).required().messages({
    'number.min': 'Duration must be at least 1 minute',
    'any.required': 'Duration is required',
  }),
  isRecurring: Joi.boolean().optional(),
  recurringDays: Joi.array()
    .items(Joi.number().min(0).max(6))
    .when('isRecurring', { is: true, then: Joi.required() })
    .messages({
      'array.includesRequiredUnknowns': 'Recurring days are required when isRecurring is true',
      'number.base': 'Each recurring day must be a number between 0 (Sunday) and 6 (Saturday)',
    }),
});

export const updateScheduleSchema = Joi.object({
  title: Joi.string().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title cannot be empty',
  }),
  startDate: Joi.date().iso().required().messages({
    'date.base': 'Invalid date format',
  }),
  startTime: Joi.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .messages({
      'string.pattern.base': 'Start time must be in HH:MM:SS format',
    }),
  duration: Joi.number().min(1).messages({
    'number.min': 'Duration must be at least 1 minute',
  }),
  isRecurring: Joi.boolean().optional(),
  recurringDays: Joi.array().items(Joi.number().min(0).max(6)).messages({
    'number.base': 'Each recurring day must be a number between 0 (Sunday) and 6 (Saturday)',
  }),
});
