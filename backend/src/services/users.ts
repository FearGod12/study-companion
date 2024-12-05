import User, { IUser } from '../models/users.js';
import { CustomError } from '../utils/customError.js';
import { generateToken } from '../utils/jwt.js';
import { EmailSubject, sendMail } from '../utils/sendMail.js';
import { cloudinayService } from './cloudinary.js';
import { redisService } from './redis.js';

export class userService {
  static async createUser(data: any): Promise<IUser | null> {
    if (data.password !== data.confirmPassword) {
      throw new CustomError(400, 'Passwords do not match');
    }
    const user = await User.findOne({ email: data.email });
    if (user) {
      throw new CustomError(400, 'Email already exists');
    }

    // 6 digit reset token
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const key = data.email + token;
    await redisService.saveData(key, token);
    const newUser = await new User(data).save();

    // send email to user with token
    sendMail(EmailSubject.VerifyEmail, 'emailVerification', { user: newUser, token });
    return newUser;
  }

  static async verifyEmail(email: string, token: string) {
    const key = email + token;
    const data = await redisService.getData(key);
    if (!data) {
      throw new CustomError(400, 'Invalid token');
    }
    const user = await User.findOneAndUpdate({ email }, { emailVerified: true });
    redisService.deleteData(key);
    return user;
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError(400, 'Invalid email or password');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new CustomError(400, 'Invalid email or password');
    }
    // jwt token
    const jwtToken = generateToken({ _id: user._id as string, email: user.email });

    return jwtToken;
  }

  static async updateAvatar(file: Express.Multer.File, user: IUser) {
    try {
      // Upload to cloudinary directly from buffer
      const result = await cloudinayService.uploadBuffer(file.buffer, file.mimetype);

      // Update user avatar
      user.avatar = result.url;
      await user.save();
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async updateUser(id: string, data: any) {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
      throw new CustomError(404, 'User not found');
    }
    return user;
  }
}
