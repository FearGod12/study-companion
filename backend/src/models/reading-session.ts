// src/models/ReadingSession.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IReadingSession extends Document {
  userId: mongoose.Types.ObjectId;
  scheduleId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  lastCheckIn: Date;
  duration: number; // actual duration in minutes
  status: 'active' | 'completed' | 'interrupted';
  createdAt: Date;
  updatedAt: Date;
}

const readingSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: 'Schedule',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    lastCheckIn: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'interrupted'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

export const ReadingSession = mongoose.model<IReadingSession>(
  'ReadingSession',
  readingSessionSchema,
);
