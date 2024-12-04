import { ISchedule, Schedule } from '../models/schedule.js';
import { NotificationService } from './notifications.js';
import { CustomError } from '../utils/customError.js';

export class ScheduleService {
  static async createSchedule(userId: string, scheduleData: Partial<ISchedule>) {
    // Combine startDate and startTime into a single DateTime
    const combinedStartTime = new Date(`${scheduleData.startDate}T${scheduleData.startTime}+01:00`);

    // Check for overlapping schedules
    const overlapping = await this.checkOverlappingSchedules(
      userId,
      combinedStartTime,
      scheduleData.duration!
    );

    if (overlapping) {
      throw new CustomError(400, 'This schedule overlaps with another study session');
    }

    const schedule = new Schedule({
      userId,
      ...scheduleData,
      startTime: combinedStartTime,
      endTime: new Date(combinedStartTime.getTime() + scheduleData.duration! * 60000),
    });
    await schedule.validate();
    await schedule.save();

    await NotificationService.scheduleNotifications(schedule._id!.toString());
    return schedule;
  }
  static async updateSchedule(
    userId: string,
    scheduleId: string,
    updates: Partial<ISchedule> & { startDate?: string; startTime?: string }
  ): Promise<ISchedule | null> {
    const existingSchedule = await Schedule.findOne({ _id: scheduleId, userId });
    if (!existingSchedule) {
      throw new CustomError(404, 'Schedule not found');
    }

    // Combine startDate and startTime if either is provided
    let combinedStartTime: Date | undefined;
    let date: string | undefined;
    if (updates.startDate || updates.startTime) {
      date = updates.startDate || existingSchedule.startTime.toISOString().split('T')[0];
      const time = updates.startTime || existingSchedule.startTime.toTimeString().split(' ')[0];
      combinedStartTime = new Date(`${date}T${time}`);
    }

    // If updating time, check for overlaps
    if (combinedStartTime) {
      const duration = updates.duration || existingSchedule.duration;

      const overlapping = await this.checkOverlappingSchedules(
        userId,
        combinedStartTime,
        duration,
        scheduleId
      );

      if (overlapping) {
        throw new CustomError(400, 'This update would cause overlap with another study session');
      }

      // Remove startDate and startTime, replace with startTime
      delete updates.startDate;
      updates.startDate = date as any;
      updates.startTime = combinedStartTime as any;
    }

    const schedule = await Schedule.findOneAndUpdate({ _id: scheduleId, userId }, updates, {
      new: true,
      runValidators: true,
    });

    if (schedule) {
      // await NotificationService.updateNotifications(schedule._id!.toString());
    }

    return schedule;
  }

  static async deleteSchedule(userId: string, scheduleId: string): Promise<void> {
    const schedule = await Schedule.findOneAndUpdate(
      { _id: scheduleId, userId },
      { isActive: false },
      { new: true }
    );

    if (!schedule) {
      throw new CustomError(404, 'Schedule not found');
    }

    await NotificationService.cancelNotifications(schedule._id!.toString());
  }

  static async getSchedules(userId: string): Promise<ISchedule[]> {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return Schedule.find({
      userId,
      isActive: true,
      startTime: { $gte: now, $lte: thirtyDaysFromNow },
    }).sort({ startTime: 1 });
  }

  private static async checkOverlappingSchedules(
    userId: string,
    startTime: Date,
    duration: number,
    excludeId?: string
  ): Promise<boolean> {
    const endTime = new Date(startTime.getTime() + duration * 60000);
    const query: any = {
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
