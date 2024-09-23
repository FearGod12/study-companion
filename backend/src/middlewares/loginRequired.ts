// responsible for decoding the token to be sent and fetching the user from database then attach it to the request object
import { NextFunction, Request, Response } from 'express';
import User from '../models/users.js';
import { CustomError } from '../utils/customError.js';
import { Payload, verifyToken } from '../utils/jwt.js';

/**
 * Middleware function to check if a user is logged in.
 *
 * @param req - The request object.
 * @param _res - The response object.
 * @param next - The next function to call.
 */
const isAuthenticated = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let authorization = req.headers['authorization'];
    if (!authorization) {
      throw new CustomError(401, 'Authorization Token required');
    }
    let token;
    if (authorization.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
    } else {
      token = authorization;
    }

    if (!token) {
      throw new CustomError(401, 'Invalid Authorization Token');
    }
    let payload: Payload = verifyToken(token) as Payload;
    if (!payload) {
      throw new CustomError(401, 'Invalid Authorization Token');
    }

    const user = await User.findById(payload._id);
    if (!user) {
      throw new CustomError(401, 'Invalid Authorization Token');
    }
    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default isAuthenticated;
