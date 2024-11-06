// src/services/ScheduleService.ts
import { Schedule } from '../models/schedule.js';
import { NotificationService } from './notifications.js';
export class ScheduleService {
    static async createSchedule(userId, scheduleData) {
        const schedule = new Schedule({
            userId,
            ...scheduleData,
        });
        await schedule.validate();
        await schedule.save();
        await NotificationService.scheduleNotifications(schedule._id.toString());
        return schedule;
    }
    static async updateSchedule(userId, scheduleId, updates) {
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
        if (schedule) {
            await NotificationService.cancelNotifications(schedule._id.toString());
        }
    }
    static async getSchedules(userId) {
        return Schedule.find({
            userId,
            isActive: true,
        }).sort({ startTime: 1 });
    }
}
