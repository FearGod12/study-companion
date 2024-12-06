import User from '../models/users.js';
import { redisService } from '../services/redis.js';
import { userService } from '../services/users.js';
import { CustomError } from '../utils/customError.js';
import { makeResponse } from '../utils/makeResponse.js';
import { EmailSubject, sendMail } from '../utils/sendMail.js';
import { LoginValidator, resetPasswordSchema, UpdateMeValidator, UserValidator, VerifyEmailValidator, } from '../utils/validators/users.js';
export class UserController {
    static createUser = async (req, res, next) => {
        try {
            const { firstName, lastName, phoneNumber, email, category, password, confirmPassword, address, } = req.body;
            const { error } = UserValidator.validate({
                firstName,
                lastName,
                phoneNumber,
                email,
                password,
                category,
                confirmPassword,
                address,
            });
            if (error) {
                return res.status(400).json(makeResponse(false, error.details[0].message, null));
            }
            const user = await userService.createUser({
                firstName,
                lastName,
                phoneNumber,
                email,
                password,
                category,
                confirmPassword,
                address,
            });
            res
                .status(201)
                .json(makeResponse(true, 'Account created successfully. Please use the code sent to your email to verify your account', user));
        }
        catch (error) {
            next(error);
        }
    };
    static verifyEmail = async (req, res, next) => {
        try {
            const { email, token } = req.body;
            const { error } = VerifyEmailValidator.validate({ email, token });
            if (error) {
                return res.status(400).json(makeResponse(false, error.details[0].message, null));
            }
            const user = await userService.verifyEmail(email, token);
            res.status(200).json(makeResponse(true, 'Email verified successfully', user));
        }
        catch (error) {
            next(error);
        }
    };
    static login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const { error } = LoginValidator.validate({ email, password });
            if (error) {
                return res.status(400).json(makeResponse(false, error.details[0].message, null));
            }
            const { token, expiresAt } = await userService.login(email, password);
            res.json(makeResponse(true, 'User logged in successfully', { access_Token: token, expiresAt }));
        }
        catch (error) {
            next(error);
        }
    };
    static getMe = async (req, res, next) => {
        try {
            const user = req.user;
            res.json(makeResponse(true, 'User Account retrieved successfully', user));
        }
        catch (error) {
            next(error);
        }
    };
    static updateUser = async (req, res, next) => {
        try {
            const { firstName, lastName, phoneNumber, category, address } = req.body;
            const updateData = {
                firstName,
                lastName,
                phoneNumber,
                category,
                address,
            };
            // remove undefined values from updateData
            Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
            const { error } = UpdateMeValidator.validate(updateData);
            if (error) {
                throw new CustomError(400, error.details[0].message);
            }
            const user = req.user;
            const updatedUser = await userService.updateUser(user._id, updateData);
            res.json(makeResponse(true, 'User updated successfully', updatedUser));
        }
        catch (error) {
            next(error);
        }
    };
    static updateAvatar = async (req, res, next) => {
        try {
            const user = req.user;
            const file = req.file;
            if (!file) {
                return res.status(400).json(makeResponse(false, 'No file uploaded', null));
            }
            const updatedUser = await userService.updateAvatar(file, user);
            res.json(makeResponse(true, 'avatar updated successfully', updatedUser));
        }
        catch (error) {
            next(error);
        }
    };
    static updateMe = async (req, res, next) => {
        try {
            const user = req.user;
            const { firstName, lastName, email, address } = req.body;
            const { error } = UpdateMeValidator.validate({
                firstName,
                lastName,
                email,
                address,
            });
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const updatedUser = await user.updateOne(req.body);
            res.json(makeResponse(true, 'User Account updated successfully', updatedUser));
        }
        catch (error) {
            next(error);
        }
    };
    static async requestPasswordReset(req, res, next) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                throw new CustomError(404, 'User not found');
            }
            const token = Math.floor(100000 + Math.random() * 900000);
            const key = email + token;
            await redisService.saveData(key, token);
            sendMail(EmailSubject.ResetPassword, 'resetPassword', {
                user: user,
                token: token.toString(),
            });
            res
                .status(200)
                .json(makeResponse(true, 'Reset Password Process Initiated Successfully! Please Use the code sent to your email to reset your password', null));
        }
        catch (error) {
            next(error);
        }
    }
    static async resetPassword(req, res, next) {
        try {
            const { token, password, confirmPassword, email } = req.body;
            const { error } = resetPasswordSchema.validate({
                token,
                password,
                confirmPassword,
                email,
            });
            if (error) {
                throw new CustomError(400, error.message);
            }
            const user = await User.findOne({ email });
            if (!user) {
                throw new CustomError(404, `User with email ${email} not found`);
            }
            const key = user.email + token;
            const data = await redisService.getData(key);
            if (!data) {
                throw new CustomError(400, 'Invalid or Expired token');
            }
            if (password !== confirmPassword) {
                throw new CustomError(400, 'Passwords do not match');
            }
            user.password = password;
            await user.save();
            redisService.deleteData(key);
            res.status(200).json(makeResponse(true, 'Password Reset Successful', null));
        }
        catch (error) {
            next(error);
        }
    }
}
