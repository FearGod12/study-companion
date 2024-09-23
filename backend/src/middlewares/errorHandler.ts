// create an error handler to handle different http errors depending on status code
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customError.js';
import { EmailSubject, sendErrorMail } from '../utils/sendMail.js';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ success: false, message: err.message, data: null });
  } else {
    if (['production', 'testing'].includes(process.env.NODE_ENV ?? ''))
      sendErrorMail(EmailSubject.ServerError, '500-Server-Error', err, req);
    res
      .status(500)
      .json({ success: false, message: err.message || 'Internal Server Error', data: null });
  }
};
