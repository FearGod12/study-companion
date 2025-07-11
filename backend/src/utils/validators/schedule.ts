import Joi from 'joi';
import { isDateInPast } from '../timezone.js';

export const createScheduleSchema = Joi.object({
  title: Joi.string().required(),
  startDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Start date must be in the format YYYY-MM-DD',
      'date.past': 'Start date cannot be in the past',
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
  title: Joi.string(),
  startDate: Joi.date().iso().messages({
    'date.base': 'Invalid date format',
  }),
  startTime: Joi.string(),
  duration: Joi.number().min(1).messages({
    'number.min': 'Duration must be at least 1 minute',
  }),
  isRecurring: Joi.boolean().optional(),
  recurringDays: Joi.array().items(Joi.number().min(0).max(6)).messages({
    'number.base': 'Each recurring day must be a number between 0 (Sunday) and 6 (Saturday)',
  }),
});
