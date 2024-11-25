import mongoose, { Document, Schema } from 'mongoose';
import { CustomError } from '../utils/customError.js';

export interface ISchedule extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  startDate: Date;
  startTime: Date;
  endTime: Date;
  duration: number;
  isRecurring: boolean;
  recurringDays?: number[];
  isActive: boolean;
  status: string;
  checkInInterval?: number;
  reminderTimes: number[];
  lastCompletedAt?: Date; // Track completion for recurring schedules
  completionCount: number; // Track total completions
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema(
  {
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
    endTime: {
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
        validator: (v: number[]) => v.every(day => day >= 0 && day <= 6),
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
        validator: (v: number[]) => v.length <= 5, // Maximum 5 reminders
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
  },
  {
    timestamps: true,
  }
);

// Make virtuals available when converting to JSON
scheduleSchema.set('toJSON', { virtuals: true });
scheduleSchema.set('toObject', { virtuals: true });

// Create indexes for efficient querying
scheduleSchema.index({ userId: 1, startTime: 1 });
scheduleSchema.index({ isActive: 1, startTime: 1 });
scheduleSchema.index({ status: 1, startTime: 1 });

// Pre-save middleware to validate startTime is in the future
scheduleSchema.pre('save', function (next) {
  if (this.startTime && this.startTime <= new Date()) {
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
scheduleSchema.statics.findActiveByUser = function (userId: string) {
  return this.find({
    userId,
    isActive: true,
    startTime: { $gte: new Date() },
  }).sort({ startTime: 1 });
};

scheduleSchema.statics.findUpcoming = function (userId: string, limit = 5) {
  return this.find({
    userId,
    isActive: true,
    startTime: { $gte: new Date() },
  })
    .sort({ startTime: 1 })
    .limit(limit);
};

export const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);
