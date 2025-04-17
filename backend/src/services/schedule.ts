import { PrismaClient } from '@prisma/client';
import { CustomError } from '../utils/customError.js';
import { addMinutesInNigeria, combineDateAndTime } from '../utils/timezone.js';
import { ScheduleInput, scheduleValidationSchema } from '../validators/schedule.js';
import { NotificationService } from './notifications.js';

const prisma = new PrismaClient();

export class ScheduleService {
  static async createSchedule(userId: string, scheduleData: ScheduleInput) {
    // Check for overlapping schedules
    const startTime = combineDateAndTime(scheduleData.startDate, scheduleData.startTime);
    const endTime = addMinutesInNigeria(startTime.toJSDate(), scheduleData.duration);

    const overlappingSchedule = await prisma.schedule.findFirst({
      where: {
        userId,
        isActive: true,
        startTime: {
          lte: startTime.toJSDate(),
        },
        endTime: {
          gte: startTime.toJSDate(),
        },
      },
    });

    if (overlappingSchedule) {
      throw new CustomError(400, 'Schedule overlaps with an existing schedule');
    }

    // Create schedule with recurring days in a transaction
    const schedule = await prisma.$transaction(async tx => {
      const newSchedule = await tx.schedule.create({
        data: {
          title: scheduleData.title,
          startDate: new Date(scheduleData.startDate),
          startTime: startTime.toJSDate(),
          endTime: endTime,
          duration: scheduleData.duration,
          isRecurring: scheduleData.isRecurring,
          isActive: scheduleData.isActive ?? true,
          status: scheduleData.status ?? 'SCHEDULED',
          checkInInterval: scheduleData.checkInInterval ?? 15,
          reminderTimes: scheduleData.reminderTimes ?? [30, 5],
          userId,
          recurringDays:
            scheduleData.isRecurring && scheduleData.recurringDays?.length
              ? {
                  create: scheduleData.recurringDays.map((dayOfWeek: number) => ({
                    dayOfWeek,
                  })),
                }
              : undefined,
        },
      });

      return newSchedule;
    });

    await NotificationService.scheduleNotifications(schedule.id);
    return schedule;
  }

  static async updateSchedule(userId: string, scheduleId: string, updates: Partial<ScheduleInput>) {
    const { error, value: validatedData } = scheduleValidationSchema.validate(updates, {
      abortEarly: false,
    });
    if (error) {
      throw new CustomError(400, error.details[0].message);
    }

    // Check for overlapping schedules
    if (validatedData.startDate && validatedData.startTime) {
      const startTime = combineDateAndTime(validatedData.startDate, validatedData.startTime);
      const endTime = addMinutesInNigeria(startTime.toJSDate(), validatedData.duration || 0);

      const overlappingSchedule = await prisma.schedule.findFirst({
        where: {
          id: { not: scheduleId },
          userId,
          startTime: {
            lte: startTime.toJSDate(),
          },
          endTime: {
            gte: startTime.toJSDate(),
          },
        },
      });

      if (overlappingSchedule) {
        throw new CustomError(400, 'Schedule overlaps with an existing schedule');
      }
    }

    // Update schedule and recurring days in a transaction
    const schedule = await prisma.$transaction(async tx => {
      const updateData: any = { ...validatedData };

      if (validatedData.startDate && validatedData.startTime) {
        const startTime = combineDateAndTime(validatedData.startDate, validatedData.startTime);
        const endTime = addMinutesInNigeria(startTime.toJSDate(), validatedData.duration || 0);

        updateData.startDate = new Date(validatedData.startDate);
        updateData.startTime = startTime.toJSDate();
        updateData.endTime = endTime;
      }


      // Handle recurring days update
      if (validatedData.recurringDays !== undefined && validatedData.recurringDays.length !== 0) {
        // Delete existing recurring days
        await tx.recurringDay.deleteMany({
          where: { scheduleId },
        });


        // Create new recurring days if schedule is recurring
        if (validatedData.isRecurring && validatedData.recurringDays?.length) {
          updateData.recurringDays = {
            create: validatedData.recurringDays.map((dayOfWeek: number) => ({
              dayOfWeek,
            })),
          };
        }
      }

      const updatedSchedule = await tx.schedule.update({
        where: { id: scheduleId },
        data: updateData,
      });

      return updatedSchedule;
    });

    if (schedule) {
      await NotificationService.updateSchedule(schedule.id);
    }

    return {
      ...schedule,
      startTime: this.convertToNigeriaTimezone(schedule.startTime),
      endTime: this.convertToNigeriaTimezone(schedule.endTime),
      startDate: schedule.startDate.toISOString().slice(0, 10),
    };
  }

  static async deleteSchedule(userId: string, scheduleId: string): Promise<void> {
    const schedule = await prisma.schedule.updateMany({
      where: {
        id: scheduleId,
        userId,
      },
      data: { isActive: false },
    });

    if (schedule.count === 0) {
      throw new CustomError(404, 'Schedule not found');
    }

    await NotificationService.cancelNotifications(scheduleId);
  }

  // utitly function for converting A DATETIME TO USE NIGERIA TIMEZONE
  static convertToNigeriaTimezone(date: Date): Date {
    return new Date(date.getTime() + 1 * 60 * 60 * 1000);
  }

  static async getSchedules(userId: string) {
    const now = new Date();
    const NintyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const result = prisma.schedule.findMany({
      where: {
        userId,
        isActive: true,
        startTime: { lte: NintyDaysFromNow },
      },
      include: {
        recurringDays: {
          select: { dayOfWeek: true },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
    return (await result).map(schedule => ({
      ...schedule,
      startTime: ScheduleService.convertToNigeriaTimezone(schedule.startTime),
      endTime: ScheduleService.convertToNigeriaTimezone(schedule.endTime),
      startDate: schedule.startDate.toISOString().slice(0, 10), // Get only YYYY-MM-DD
    }));
  }

  private static async checkOverlappingSchedules(
    userId: string,
    startTime: Date,
    duration: number,
    excludeId?: string,
  ): Promise<boolean> {
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const overlapping = await prisma.schedule.findFirst({
      where: {
        userId,
        isActive: true,
        id: excludeId ? { not: excludeId } : undefined,
        OR: [
          // New schedule starts within an existing schedule
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        ],
      },
    });

    return !!overlapping;
  }
}
