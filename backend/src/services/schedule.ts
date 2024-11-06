// src/services/ScheduleService.ts
import { ISchedule, Schedule } from '../models/schedule.js';
import { NotificationService } from './notifications.js';

export class ScheduleService {
  static async createSchedule(userId: string, scheduleData: Partial<ISchedule>) {
    const schedule = new Schedule({
      userId,
      ...scheduleData,
    });
    await schedule.validate();
    await schedule.save();

    await NotificationService.scheduleNotifications(schedule._id.toString());
    return schedule;
  }

  static async updateSchedule(
    userId: string,
    scheduleId: string,
    updates: Partial<ISchedule>,
  ): Promise<ISchedule | null> {
    const schedule = await Schedule.findOneAndUpdate({ _id: scheduleId, userId }, updates, {
      new: true,
      runValidators: true,
    });

    if (schedule) {
      await NotificationService.updateNotifications(schedule._id.toString());
    }

    return schedule;
  }

  static async deleteSchedule(userId: string, scheduleId: string): Promise<void> {
    const schedule = await Schedule.findOneAndUpdate(
      { _id: scheduleId, userId },
      { isActive: false },
      { new: true },
    );

    if (schedule) {
      await NotificationService.cancelNotifications(schedule._id.toString());
    }
  }

  static async getSchedules(userId: string): Promise<ISchedule[]> {
    return Schedule.find({
      userId,
      isActive: true,
    }).sort({ startTime: 1 });
  }
}
