// src/models/ReadingSession.ts
import mongoose, { Schema } from 'mongoose';
const readingSessionSchema = new Schema({
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
}, {
    timestamps: true,
});
export const ReadingSession = mongoose.model('ReadingSession', readingSessionSchema);
