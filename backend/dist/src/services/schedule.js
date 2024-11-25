import { Schedule } from '../models/schedule.js';
import { NotificationService } from './notifications.js';
import { CustomError } from '../utils/customError.js';
export class ScheduleService {
    static async createSchedule(userId, scheduleData) {
        // Combine startDate and startTime into a single DateTime
        const combinedStartTime = new Date(`${scheduleData.startDate}T${scheduleData.startTime}+01:00`);
        console.log('combinedStartTime:', combinedStartTime);
        // Check for overlapping schedules
        const overlapping = await this.checkOverlappingSchedules(userId, combinedStartTime, scheduleData.duration);
        if (overlapping) {
            throw new CustomError(400, 'This schedule overlaps with another study session');
        }
        console.log('about to create a schedule');
        const schedule = new Schedule({
            userId,
            ...scheduleData,
            startTime: combinedStartTime,
            endTime: new Date(combinedStartTime.getTime() + scheduleData.duration * 60000),
        });
        console.log('schedule:', schedule);
        await schedule.validate();
        await schedule.save();
        await NotificationService.scheduleNotifications(schedule._id.toString());
        return schedule;
    }
    static async updateSchedule(userId, scheduleId, updates) {
        const existingSchedule = await Schedule.findOne({ _id: scheduleId, userId });
        if (!existingSchedule) {
            throw new CustomError(404, 'Schedule not found');
        }
        // Combine startDate and startTime if either is provided
        let combinedStartTime;
        let date;
        if (updates.startDate || updates.startTime) {
            date = updates.startDate || existingSchedule.startTime.toISOString().split('T')[0];
            const time = updates.startTime || existingSchedule.startTime.toTimeString().split(' ')[0];
            combinedStartTime = new Date(`${date}T${time}`);
        }
        // If updating time, check for overlaps
        if (combinedStartTime) {
            const duration = updates.duration || existingSchedule.duration;
            const overlapping = await this.checkOverlappingSchedules(userId, combinedStartTime, duration, scheduleId);
            if (overlapping) {
                throw new CustomError(400, 'This update would cause overlap with another study session');
            }
            // Remove startDate and startTime, replace with startTime
            delete updates.startDate;
            updates.startDate = date;
            updates.startTime = combinedStartTime;
        }
        const schedule = await Schedule.findOneAndUpdate({ _id: scheduleId, userId }, updates, {
            new: true,
            runValidators: true,
        });
        if (schedule) {
            await NotificationService.updateNotifications(schedule._id.toString());
        }
        return schedule;
    }
    static async deleteSchedule(userId, scheduleId) {
        const schedule = await Schedule.findOneAndUpdate({ _id: scheduleId, userId }, { isActive: false }, { new: true });
        if (!schedule) {
            throw new CustomError(404, 'Schedule not found');
        }
        await NotificationService.cancelNotifications(schedule._id.toString());
    }
    static async getSchedules(userId) {
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return Schedule.find({
            userId,
            isActive: true,
            startTime: { $gte: now, $lte: thirtyDaysFromNow },
        }).sort({ startTime: 1 });
    }
    static async checkOverlappingSchedules(userId, startTime, duration, excludeId) {
        const endTime = new Date(startTime.getTime() + duration * 60000);
        const query = {
            userId,
            isActive: true,
            $or: [
                // New schedule starts within an existing schedule
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime },
                },
            ],
        };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }
        const overlapping = await Schedule.findOne(query);
        return !!overlapping;
    }
}
