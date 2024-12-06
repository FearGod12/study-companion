import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/customError.js';
const SECRET = process.env.SECRET_KEY || 'MY SUPER SECRETE KEY';
/**
 * Generates a JWT token for the given user payload.
 * @param user - The user payload containing id, email
 * @returns The generated JWT token.
 */
export const generateToken = (user) => {
    const expiresIn = '24h';
    const expiresInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const expiresAt = new Date(Date.now() + expiresInMs);
    const token = jwt.sign({
        _id: user._id,
        email: user.email,
    }, SECRET, { expiresIn });
    return { token, expiresAt };
};
/**
 * Verifies the authenticity of a JWT token.
 * @param token - The JWT token to be verified.
 * @returns The decoded payload of the JWT token if it is valid, otherwise null.
 * @throws {CustomError} If the token has expired or is invalid.
 */
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET);
        if (typeof decoded === 'string') {
            return null;
        }
        return decoded;
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new CustomError(400, 'Token expired');
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            throw new CustomError(400, 'Invalid token');
        }
        return null;
    }
};
