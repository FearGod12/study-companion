import User from '../models/users.js';
import { CustomError } from '../utils/customError.js';
import { generateToken } from '../utils/jwt.js';
import { EmailSubject, sendMail } from '../utils/sendMail.js';
import { cloudinayService } from './cloudinary.js';
import { redisService } from './redis.js';
export class userService {
    static async createUser(data) {
        if (data.password !== data.confirmPassword) {
            throw new CustomError(400, 'Passwords do not match');
        }
        const user = await User.findOne({ email: data.email });
        if (user) {
            throw new Error('Email already exists');
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
    static async verifyEmail(email, token) {
        const key = email + token;
        const data = await redisService.getData(key);
        if (!data) {
            throw new CustomError(400, 'Invalid token');
        }
        const user = await User.findOneAndUpdate({ email }, { emailVerified: true });
        redisService.deleteData(key);
        return user;
    }
    static async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError(400, 'Invalid email or password');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new CustomError(400, 'Invalid email or password');
        }
        // jwt token
        const jwtToken = generateToken({ _id: user._id, email: user.email });
        return jwtToken;
    }
    static async updateAvatar(file, user) {
        try {
            // Upload to cloudinary directly from buffer
            const result = await cloudinayService.uploadBuffer(file.buffer, file.mimetype);
            // Update user avatar
            user.avatar = result.url;
            await user.save();
            return user;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
