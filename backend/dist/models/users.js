import bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';
import mongoDBConnection from '../config/mongodb.js';
const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
            message: 'Please enter a valid email address',
        },
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
    },
    category: {
        type: String,
        enum: ['O level', 'undergraduate', 'graduate'],
        required: [true, 'Category is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    avatar: {
        type: String,
    },
}, {
    timestamps: true,
    methods: {
        async comparePassword(candidatePassword) {
            return bcrypt.compare(candidatePassword, this.password);
        },
    },
});
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});
const User = mongoDBConnection.model('User', UserSchema);
export default User;
