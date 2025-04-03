import Joi from 'joi';
import { isDateInPast, NIGERIA_TIMEZONE } from '../utils/timezone.js';

export const scheduleValidationSchema = Joi.object({
  title: Joi.string().required(),
  startDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Start date must be in the format YYYY-MM-DD',
      'any.required': 'Start date is required',
    }),
  startTime: Joi.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .required()
    .messages({
      'string.pattern.base': 'Start time must be in HH:MM:SS format',
      'any.required': 'Start time is required',
    }),
  duration: Joi.number().integer().min(1).max(1440).required(),
  isRecurring: Joi.boolean().default(false),
  recurringDays: Joi.array().items(Joi.number().min(0).max(6)).when('isRecurring', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  isActive: Joi.boolean().default(true),
  status: Joi.string()
    .valid('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'MISSED')
    .default('SCHEDULED'),
  checkInInterval: Joi.number().integer().min(1).max(60).default(15),
  reminderTimes: Joi.array().items(Joi.number().integer().min(1)).default([30, 5]),
});

export type ScheduleInput = {
  title: string;
  startDate: string;
  startTime: string;
  duration: number;
  isRecurring: boolean;
  recurringDays?: number[];
  isActive?: boolean;
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED';
  checkInInterval?: number;
  reminderTimes?: number[];
};
