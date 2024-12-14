import mongoose from 'mongoose';
import { ReadingSession } from '../models/reading-session.js';
import { Schedule } from '../models/schedule.js';
import { NotificationService } from '../services/notifications.js';
import { CustomError } from '../utils/customError.js';
import { makeResponse } from '../utils/makeResponse.js';
export class ReadingSessionController {
    // Start a reading session
    static async startSession(req, res, next) {
        try {
            const { scheduleId } = req.params;
            // Verify schedule exists and belongs to user
            const schedule = await Schedule.findOne({
                _id: scheduleId,
                userId: req.user._id,
                isActive: true,
            });
            if (!schedule) {
                throw new CustomError(404, 'Schedule not found');
            }
            // Check for any active sessions
            const activeSession = await ReadingSession.findOne({
                userId: req.user._id,
                status: 'active',
            });
            if (activeSession) {
                // check if the active session is for the same schedule
                if (activeSession.scheduleId.toString() === scheduleId) {
                    res
                        .status(200)
                        .json(makeResponse(true, 'existing study session retrieved', activeSession));
                    return;
                }
                // check if the active session should have ended
                const activeSessionEndTime = new Date(activeSession.startTime.getTime() + activeSession.duration * 60000);
                if (activeSessionEndTime < new Date()) {
                    schedule.isActive = false;
                    await schedule.save();
                    activeSession.status = 'completed';
                    await activeSession.save();
                }
                else {
                    throw new CustomError(409, 'Another session is currently active');
                }
            }
            const session = new ReadingSession({
                userId: req.user._id,
                scheduleId,
                startTime: new Date(),
                lastCheckIn: new Date(),
                duration: schedule.duration,
            });
            await session.save();
            // cancel all scheduled notifications for this schedule
            NotificationService.cancelNotifications(scheduleId);
            res.status(201).json(makeResponse(true, 'study session started successfully', session));
        }
        catch (error) {
            next(error);
        }
    }
    // Check-in for an active session
    static async checkIn(req, res, next) {
        try {
            const { scheduleId } = req.params;
            const session = await ReadingSession.findOneAndUpdate({
                userId: req.user._id,
                status: 'active',
                scheduleId,
            }, {
                lastCheckIn: new Date(),
            }, { new: true });
            if (!session) {
                res.status(404).json({ error: 'No active session found' });
                return;
            }
            res.json(makeResponse(true, 'checkin recorded', session));
        }
        catch (error) {
            next(error);
        }
    }
    // End a reading session
    static async endSession(req, res, next) {
        try {
            console.log('end session');
            const { scheduleId } = req.params;
            const schedule = await Schedule.findOne({
                _id: scheduleId,
                userId: req.user._id,
                isActive: true,
            });
            if (!schedule) {
                throw new CustomError(404, 'Schedule not found');
            }
            const session = await ReadingSession.findOne({
                userId: req.user._id,
                status: 'active',
                scheduleId,
            });
            if (!session) {
                throw new CustomError(404, 'No active session found');
            }
            if (session.status !== 'active') {
                throw new CustomError(400, 'Session not active');
            }
            console.log(session);
            const endTime = new Date();
            const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 60000); // Convert to minutes
            session.endTime = endTime;
            session.duration = duration;
            session.status = 'completed';
            await session.save();
            schedule.isActive = false;
            await schedule.save();
            res.json(makeResponse(true, 'session ended successfully', session));
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllSessions(req, res, next) {
        try {
            const userId = req.user._id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const sessions = await ReadingSession.find({ userId })
                .skip(skip)
                .limit(limit)
                .sort({ startTime: -1 });
            const total = await ReadingSession.countDocuments({ userId });
            const totalPages = Math.ceil(total / limit);
            res.json(makeResponse(true, 'All sessions retrieved', {
                sessions,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limit,
                },
            }));
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserStatistics(req, res, next) {
        try {
            const userId = req.user._id;
            // Aggregate statistics for completed reading sessions
            const stats = await ReadingSession.aggregate([
                // Match sessions for the specific user and only completed sessions
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        status: 'completed',
                    },
                },
                // Group to calculate statistics
                {
                    $group: {
                        _id: null,
                        totalMinutesStudied: { $sum: '$duration' },
                        totalSessionsCompleted: { $sum: 1 },
                        longestSessionDuration: { $max: '$duration' },
                        averageSessionDuration: { $avg: '$duration' },
                    },
                },
            ]);
            // Get streak information (consecutive days with at least one completed session)
            const sessionsByDate = await ReadingSession.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        status: 'completed',
                    },
                },
                // Extract date from startTime
                {
                    $addFields: {
                        sessionDate: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
                    },
                },
                // Group by unique dates
                {
                    $group: {
                        _id: '$sessionDate',
                        count: { $sum: 1 },
                    },
                },
                // Sort dates
                { $sort: { _id: 1 } },
            ]);
            // Calculate current and longest streak
            let currentStreak = 0;
            let longestStreak = 0;
            let previousDate = null;
            sessionsByDate.forEach((day, index) => {
                if (previousDate === null) {
                    // First day
                    currentStreak = 1;
                    longestStreak = 1;
                    previousDate = day._id;
                    return;
                }
                // Check if the current day is exactly one day after the previous day
                const prevDate = new Date(previousDate);
                const currentDate = new Date(day._id);
                const dayDifference = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
                if (dayDifference === 1) {
                    currentStreak++;
                    longestStreak = Math.max(longestStreak, currentStreak);
                }
                else if (dayDifference > 1) {
                    currentStreak = 1;
                }
                previousDate = day._id;
            });
            // Prepare the response
            const userStats = {
                totalMinutesStudied: stats[0]?.totalMinutesStudied || 0,
                totalSessionsCompleted: stats[0]?.totalSessionsCompleted || 0,
                longestSessionDuration: stats[0]?.longestSessionDuration || 0,
                averageSessionDuration: stats[0]?.averageSessionDuration || 0,
                currentStreak,
                longestStreak,
            };
            res.json(makeResponse(true, 'User statistics retrieved successfully', userStats));
        }
        catch (error) {
            next(error);
        }
    }
}
