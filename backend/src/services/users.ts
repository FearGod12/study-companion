import { Category } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CustomError } from '../utils/customError.js';
import { generateToken } from '../utils/jwt.js';
import { EmailSubject, sendMail } from '../utils/sendMail.js';
import { cloudinayService } from './cloudinary.js';
import { redisService } from './redis.js';
import prisma from '../config/prisma.js';

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
  category: string;
  address: string;
}

interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  category?: Category;
  address?: string;
}

export class userService {
  static async createUser(data: CreateUserData) {
    if (data.password !== data.confirmPassword) {
      throw new CustomError(400, 'Passwords do not match');
    }

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new CustomError(400, 'Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 6 digit reset token
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const key = data.email + token;
    await redisService.saveData(key, token);

    // Convert string category to enum
    const categoryEnum = data.category.toUpperCase().replace(' ', '_') as Category;

    const newUser = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: hashedPassword,
        category: categoryEnum,
        address: data.address,
      },
    });

    // send email to user with token
    sendMail(EmailSubject.VerifyEmail, 'emailVerification', { user: newUser, token });

    // Don't return the password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async verifyEmail(email: string, token: string) {
    const key = email + token;
    const data = await redisService.getData(key);
    if (!data) {
      throw new CustomError(400, 'Invalid token');
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    redisService.deleteData(key);

    // Don't return the password
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new CustomError(400, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError(400, 'Invalid email or password');
    }

    // jwt token
    const jwtToken = generateToken({ id: user.id, email: user.email });

    return { access_Token: jwtToken, user };
  }

  static async updateAvatar(file: Express.Multer.File, user: any) {
    try {
      // Upload to cloudinary directly from buffer
      const result = await cloudinayService.uploadBuffer(file.buffer, file.mimetype);

      // Update user avatar
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { avatar: result.url },
      });

      // Don't return the password
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async updateUser(id: string, data: UserUpdateData) {
    // Convert category string to enum if it exists
    try {
      let categoryEnum = undefined;
      if (data.category) {
        categoryEnum = data.category;
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          category: categoryEnum,
          address: data.address,
        },
      });

      if (!updatedUser) {
        throw new CustomError(404, 'User not found');
      }

      // Don't return the password
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      throw new CustomError(500, 'Failed to update user');
    }
  }

  static async comparePassword(userId: string, candidatePassword: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new CustomError(404, 'User not found');
    }
    return bcrypt.compare(candidatePassword, user.password);
  }

  // Helper method to hash password
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
