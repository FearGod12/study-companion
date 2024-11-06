import mongoose, { Document, Schema } from 'mongoose';

export interface ISchedule extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  startTime: Date;
  duration: number; // in minutes
  isRecurring: boolean;
  recurringDays?: number[]; // 0-6 representing Sunday-Saturday
  isActive: boolean;
  status: string; // "scheduled", "in-progress", "completed", "missed"
  checkInInterval?: number; // Interval in minutes for check-ins during a session
  reminderTimes: number[]; // Notification times in minutes before startTime (e.g., [30, 5])
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
    },
    startTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
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
      default: 15, // Default check-in interval of 15 minutes, can be adjusted
    },
    reminderTimes: {
      type: [Number],
      default: [30, 5], // Send reminders 30 mins and 5 mins before start
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes for efficient querying
scheduleSchema.index({ userId: 1, startTime: 1 });
scheduleSchema.index({ isActive: 1, startTime: 1 });

export const Schedule = mongoose.model('Schedule', scheduleSchema);
