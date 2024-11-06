import Joi from 'joi';

export const validationScheduleSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title cannot be empty',
  }),
  startTime: Joi.string()
    .regex(/^\d{2}:\d{2}:\d{2}$|^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
    .required()
    .custom((value, helpers) => {
      const startTime = new Date(value);
      if (startTime <= new Date()) {
        return helpers.message({ 'string.base': 'Start time must be in the future' });
      }
      return value;
    })
    .messages({
      'string.pattern.base': 'Start time must be in the format HH:MM:SS or YYYY-MM-DDTHH:MM:SS',
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
