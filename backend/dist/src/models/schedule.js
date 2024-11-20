import mongoose, { Schema } from 'mongoose';
import { CustomError } from '../utils/customError.js';
const scheduleSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    startDate: {
        type: Date,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
        min: 1,
        max: 1440, // Max 24 hours
    },
    isRecurring: {
        type: Boolean,
        default: false,
    },
    recurringDays: {
        type: [Number],
        validate: {
            validator: (v) => v.every(day => day >= 0 && day <= 6),
            message: 'Recurring days must be between 0 and 6',
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'missed'],
        default: 'scheduled',
    },
    checkInInterval: {
        type: Number,
        default: 15,
        min: 5,
        max: 60,
    },
    reminderTimes: {
        type: [Number],
        default: [30, 5],
        validate: {
            validator: (v) => v.length <= 5, // Maximum 5 reminders
            message: 'Maximum 5 reminder times allowed',
        },
    },
    lastCompletedAt: {
        type: Date,
    },
    completionCount: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
});
// Virtual for endTime
scheduleSchema.virtual('endTime').get(function () {
    return new Date(this.startTime.getTime() + this.duration * 60000);
});
// Make virtuals available when converting to JSON
scheduleSchema.set('toJSON', { virtuals: true });
scheduleSchema.set('toObject', { virtuals: true });
// Create indexes for efficient querying
scheduleSchema.index({ userId: 1, startTime: 1 });
scheduleSchema.index({ isActive: 1, startTime: 1 });
scheduleSchema.index({ status: 1, startTime: 1 });
// Pre-save middleware to validate startTime is in the future
scheduleSchema.pre('save', function (next) {
    if (this.isNew && this.startTime < new Date()) {
        next(new CustomError(400, 'Start time must be in the future'));
    }
    next();
});
// Methods for schedule management
scheduleSchema.methods.markComplete = async function () {
    this.status = 'completed';
    this.lastCompletedAt = new Date();
    this.completionCount += 1;
    if (!this.isRecurring) {
        this.isActive = false;
    }
    await this.save();
};
scheduleSchema.methods.markMissed = async function () {
    this.status = 'missed';
    if (!this.isRecurring) {
        this.isActive = false;
    }
    await this.save();
};
scheduleSchema.methods.startSession = async function () {
    if (this.status !== 'scheduled') {
        throw new CustomError(400, 'Schedule must be in scheduled state to start');
    }
    this.status = 'in-progress';
    await this.save();
};
// Static methods for querying
scheduleSchema.statics.findActiveByUser = function (userId) {
    return this.find({
        userId,
        isActive: true,
        startTime: { $gte: new Date() },
    }).sort({ startTime: 1 });
};
scheduleSchema.statics.findUpcoming = function (userId, limit = 5) {
    return this.find({
        userId,
        isActive: true,
        startTime: { $gte: new Date() },
    })
        .sort({ startTime: 1 })
        .limit(limit);
};
export const Schedule = mongoose.model('Schedule', scheduleSchema);
