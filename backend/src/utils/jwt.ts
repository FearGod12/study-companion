import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/customError.js';

const SECRET = process.env.SECRET_KEY || 'MY SUPER SECRETE KEY';

export interface Payload {
  _id: string;
  email: string;
}

/**
 * Generates a JWT token for the given user payload.
 * @param user - The user payload containing id, email
 * @returns The generated JWT token.
 */
export const generateToken = (user: Payload): string => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    SECRET,
    { expiresIn: '24h' },
  );
};

/**
 * Verifies the authenticity of a JWT token.
 * @param token - The JWT token to be verified.
 * @returns The decoded payload of the JWT token if it is valid, otherwise null.
 * @throws {CustomError} If the token has expired or is invalid.
 */
export const verifyToken = (token: string): jwt.JwtPayload | null => {
  try {
    const decoded: string | jwt.JwtPayload = jwt.verify(token, SECRET);
    if (typeof decoded === 'string') {
      return null;
    }
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new CustomError(400, 'Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new CustomError(400, 'Invalid token');
    }
    return null;
  }
};
