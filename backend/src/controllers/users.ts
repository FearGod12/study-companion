import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/users.js';
import { makeResponse } from '../utils/makeResponse.js';
import {
  LoginValidator,
  UpdateAvatarValidator,
  UpdateMeValidator,
  UserValidator,
  VerifyEmailValidator,
} from '../utils/validators/users.js';

export class UserController {
  static createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, category, password, confirmPassword, address } = req.body;
      const { error } = UserValidator.validate({
        firstName,
        lastName,
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
        email,
        password,
        category,
        confirmPassword,
        address,
      });
      res
        .status(201)
        .json(
          makeResponse(
            true,
            'Account created successfully. Please use the code sent to your email to verify your account',
            user,
          ),
        );
    } catch (error) {
      next(error);
    }
  };

  static verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, token } = req.body;
      const { error } = VerifyEmailValidator.validate({ email, token });
      if (error) {
        return res.status(400).json(makeResponse(false, error.details[0].message, null));
      }
      const user = await userService.verifyEmail(email, token);
      res.status(200).json(makeResponse(true, 'Email verified successfully', user));
    } catch (error) {
      next(error);
    }
  };

  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { error } = LoginValidator.validate({ email, password });
      if (error) {
        return res.status(400).json(makeResponse(false, error.details[0].message, null));
      }
      const access_Token = await userService.login(email, password);
      res.json(makeResponse(true, 'User logged in successfully', { access_Token }));
    } catch (error) {
      next(error);
    }
  };

  static getMe = async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      res.json(makeResponse(true, 'User Account retrieved successfully', user));
    } catch (error) {
      next(error);
    }
  };

  static updateAvatar = async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const file = req.file;

      if (!file) {
        return res.status(400).json(makeResponse(false, 'No file uploaded', null));
      }

      const updatedUser = await userService.updateAvatar(file, user);
      res.json(makeResponse(true, 'avatar updated successfully', updatedUser));
    } catch (error) {
      next(error);
    }
  };

  static updateMe = async (req: any, res: Response, next: NextFunction) => {
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
    } catch (error) {
      next(error);
    }
  };
}
