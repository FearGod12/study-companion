import { PrismaClient, Schedule, User, Category, RecurringDay } from '@prisma/client';
import cron from 'node-cron';
import { EmailSubject, sendMail } from '../utils/sendMail.js';
import { NIGERIA_TIMEZONE, formatTimeInNigeria, addMinutesInNigeria } from '../utils/timezone.js';

// Interface for our scheduled notification in Prisma
interface ScheduledNotification {
  id: string;
  scheduleId: string;
  minutesBefore: number;
  scheduledFor: Date;
  isExecuted: boolean;
  cronJobId: string;
  isRecurring: boolean;
  recurringDayOfWeek?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Scheduled Notification Jobs
interface ScheduledNotificationJob {
  scheduleId: string;
  cronJob: cron.ScheduledTask;
}

// Extended Schedule type with user and recurringDays
type ScheduleWithRelations = Schedule & {
  user: User;
  recurringDays: RecurringDay[];
};

export class NotificationService {
  // In-memory storage of currently active cron jobs
  private static scheduledNotifications: Map<string, ScheduledNotificationJob[]> = new Map();

  // Reminder times in minutes before the event
  private static readonly REMINDER_TIMES = [30, 5] as const;

  // Timezone for scheduling
  private static readonly TIMEZONE = NIGERIA_TIMEZONE;

  private static prisma: PrismaClient;

  /**
   * Initialize the notification service with the Prisma client
   * @param prismaClient - The Prisma client instance
   */
  static init(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    console.log('Notification service initialized');
    this.recoverPendingNotifications();
  }

  /**
   * Recover and re-schedule any pending notifications
   */
  private static async recoverPendingNotifications() {
    try {
      // Find all active schedules
      const activeSchedules = await this.prisma.schedule.findMany({
        where: { isActive: true },
      });

      // Find pending scheduled notifications
      const pendingNotifications = await this.prisma.scheduledNotification.findMany({
        where: {
          isExecuted: false,
          scheduledFor: { gt: new Date() },
        },
        include: {
          schedule: true,
        },
      });

      // Re-schedule notifications for each pending notification
      for (const notification of pendingNotifications) {
        const schedule = notification.schedule;

        if (schedule && schedule.isActive) {
          await this.scheduleNotifications(schedule.id);
        }
      }
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  /**
   * Schedule notifications for a specific schedule
   * @param scheduleId - ID of the schedule to schedule notifications for
   */
  static async scheduleNotifications(scheduleId: string) {
    try {
      // First, cancel any existing notifications for this schedule
      await this.cancelNotifications(scheduleId);

      const schedule = await this.prisma.schedule.findUnique({
        where: { id: scheduleId },
        include: {
          user: true,
          recurringDays: true,
        },
      });

      if (!schedule || !schedule.isActive) {
        console.log(`Schedule ${scheduleId} not found or inactive`);
        return;
      }

      // Schedule one-time notifications
      await this.scheduleOneTimeNotifications(schedule as ScheduleWithRelations);

      // Handle recurring schedules
      if (schedule.isRecurring && schedule.recurringDays && schedule.recurringDays.length > 0) {
        const recurringDaysArray = schedule.recurringDays.map(day => day.dayOfWeek);
        await this.scheduleRecurringNotifications(
          schedule as ScheduleWithRelations,
          recurringDaysArray
        );
      }
    } catch (error) {
      console.error(`Failed to schedule notifications for ${scheduleId}:`, error);
      throw error;
    }
  }

  /**
   * Schedule one-time notifications for a schedule
   * @param schedule - Schedule to create notifications for
   */
  private static async scheduleOneTimeNotifications(schedule: ScheduleWithRelations) {
    const scheduledJobs: ScheduledNotificationJob[] = [];

    for (const minutes of this.REMINDER_TIMES) {
      const reminderTime = addMinutesInNigeria(schedule.startTime, -minutes);

      // Don't schedule if the reminder time is in the past
      if (reminderTime.getTime() <= Date.now()) {
        console.log(`Skipping ${minutes}min reminder for past schedule ${schedule.id}`);
        continue;
      }

      // Create cron job
      const cronExpression = this.createCronExpression(reminderTime);
      const job = cron.schedule(
        cronExpression,
        async () => {
          try {
            await this.sendReminderEmail(schedule, minutes);

            // Mark the notification as executed in the database
            await this.prisma.scheduledNotification.updateMany({
              where: {
                scheduleId: schedule.id,
                minutesBefore: minutes,
                isRecurring: false,
              },
              data: { isExecuted: true },
            });

            // Remove the job after it's executed
            job.stop();
          } catch (error) {
            console.error(`Error sending reminder for schedule ${schedule.id}:`, error);
          }
        },
        {
          scheduled: true,
          timezone: this.TIMEZONE,
        }
      );

      // Generate a unique identifier for the job
      const cronJobId = `${schedule.id}_${minutes}_${Date.now()}`;

      // Persist the scheduled notification in the database
      await this.prisma.scheduledNotification.create({
        data: {
          scheduleId: schedule.id,
          minutesBefore: minutes,
          scheduledFor: reminderTime,
          isExecuted: false,
          cronJobId: cronJobId,
          isRecurring: false,
        },
      });

      scheduledJobs.push({
        scheduleId: schedule.id,
        cronJob: job,
      });
    }

    // Store scheduled jobs
    this.scheduledNotifications.set(schedule.id, scheduledJobs);
  }

  /**
   * Schedule recurring notifications for a schedule
   * @param schedule - Recurring schedule to create notifications for
   * @param recurringDays - Array of days (0-6) for recurring schedule
   */
  private static async scheduleRecurringNotifications(
    schedule: ScheduleWithRelations,
    recurringDays: number[]
  ) {
    const scheduledJobs: ScheduledNotificationJob[] = [];

    for (const dayOfWeek of recurringDays) {
      for (const minutes of this.REMINDER_TIMES) {
        // Calculate the cron expression for recurring reminders
        const cronExpression = this.createRecurringCronExpression(
          schedule.startTime,
          dayOfWeek,
          minutes
        );

        const job = cron.schedule(
          cronExpression,
          async () => {
            try {
              // Verify the schedule is still active and hasn't been deleted
              const currentSchedule = await this.prisma.schedule.findUnique({
                where: { id: schedule.id },
              });

              if (!currentSchedule || !currentSchedule.isActive) {
                job.stop();
                return;
              }

              await this.sendReminderEmail(schedule, minutes);
            } catch (error) {
              console.error(`Error sending recurring reminder for schedule ${schedule.id}:`, error);
            }
          },
          {
            scheduled: true,
            timezone: this.TIMEZONE,
          }
        );

        // Generate a unique identifier for the job
        const cronJobId = `${schedule.id}_${dayOfWeek}_${minutes}_${Date.now()}`;

        // Persist the scheduled notification in the database
        await this.prisma.scheduledNotification.create({
          data: {
            scheduleId: schedule.id,
            minutesBefore: minutes,
            scheduledFor: this.calculateNextRun(schedule.startTime, dayOfWeek, minutes),
            isExecuted: false,
            cronJobId: cronJobId,
            isRecurring: true,
            recurringDayOfWeek: dayOfWeek,
          },
        });

        scheduledJobs.push({
          scheduleId: schedule.id,
          cronJob: job,
        });
      }
    }

    // Store or update scheduled jobs for this schedule
    const existingJobs = this.scheduledNotifications.get(schedule.id) || [];
    this.scheduledNotifications.set(schedule.id, [...existingJobs, ...scheduledJobs]);
  }

  /**
   * Send a reminder email for a specific schedule
   * @param schedule - Schedule to send reminder for
   * @param minutes - Minutes before the schedule to send reminder
   */
  private static async sendReminderEmail(schedule: ScheduleWithRelations, minutes: number) {
    const user = schedule.user;
    if (!user) {
      console.error(`User not found for schedule ${schedule.id}`);
      return;
    }

    sendMail(EmailSubject.StudySessionReminder, 'reading-reminder', {
      user: user,
      title: schedule.title,
      minutes: minutes,
      startTime: formatTimeInNigeria(schedule.startTime),
      duration: schedule.duration,
    });

    console.log(`Reminder sent for schedule ${schedule.id} (${minutes} minutes)`);
  }

  /**
   * Cancel notifications for a specific schedule
   * @param scheduleId - ID of the schedule to cancel notifications for
   */
  static async cancelNotifications(scheduleId: string) {
    const scheduledJobs = this.scheduledNotifications.get(scheduleId);

    if (scheduledJobs) {
      console.log(`Cancelling ${scheduledJobs.length} notifications for schedule ${scheduleId}`);

      scheduledJobs.forEach(job => {
        job.cronJob.stop();
      });

      // Remove the entry from the map
      this.scheduledNotifications.delete(scheduleId);

      // Remove scheduled notifications from database
      await this.prisma.scheduledNotification.deleteMany({
        where: {
          scheduleId: scheduleId,
          isExecuted: false,
        },
      });
    }
  }

  /**
   * Update notifications for a schedule
   * @param scheduleId - ID of the schedule to update
   */
  static async updateSchedule(scheduleId: string) {
    try {
      // Cancel existing notifications
      await this.cancelNotifications(scheduleId);

      const schedule = await this.prisma.schedule.findUnique({
        where: { id: scheduleId },
      });

      if (!schedule || !schedule.isActive) {
        return;
      }

      // Schedule new notifications
      await this.scheduleNotifications(scheduleId);
    } catch (error) {
      console.error(`Failed to update notifications for ${scheduleId}:`, error);
      throw error;
    }
  }

  /**
   * Mark a schedule as complete
   * @param scheduleId - ID of the schedule to mark complete
   */
  static async markScheduleComplete(scheduleId: string) {
    try {
      const schedule = await this.prisma.schedule.findUnique({
        where: { id: scheduleId },
      });

      if (!schedule) {
        return;
      }

      // If it's a one-time schedule, mark it inactive
      if (!schedule.isRecurring) {
        await this.prisma.schedule.update({
          where: { id: scheduleId },
          data: { isActive: false },
        });

        await this.cancelNotifications(scheduleId);
      }
    } catch (error) {
      console.error(`Failed to mark schedule ${scheduleId} as complete:`, error);
      throw error;
    }
  }

  /**
   * Create a cron expression for a one-time notification
   * @param reminderTime - Time to schedule the notification
   * @returns Cron expression string
   */
  private static createCronExpression(reminderTime: Date): string {
    return `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${
      reminderTime.getMonth() + 1
    } *`;
  }

  /**
   * Create a cron expression for recurring notifications
   * @param startTime - Original start time of the schedule
   * @param dayOfWeek - Day of week for recurring schedule
   * @param minutesBefore - Minutes before the schedule to send reminder
   * @returns Cron expression string
   */
  private static createRecurringCronExpression(
    startTime: Date,
    dayOfWeek: number,
    minutesBefore: number
  ): string {
    const reminderTime = addMinutesInNigeria(startTime, -minutesBefore);
    return `${reminderTime.getMinutes()} ${reminderTime.getHours()} * * ${dayOfWeek}`;
  }

  /**
   * Calculate the next run time for a recurring notification
   * @param startTime - Original start time of the schedule
   * @param dayOfWeek - Day of week for recurring schedule
   * @param minutesBefore - Minutes before the schedule to send reminder
   * @returns Date of next scheduled run
   */
  private static calculateNextRun(startTime: Date, dayOfWeek: number, minutesBefore: number): Date {
    const reminderTime = addMinutesInNigeria(startTime, -minutesBefore);
    const nextRun = new Date();

    // Set to next occurrence of the specific day of week
    nextRun.setDate(nextRun.getDate() + ((dayOfWeek + 7 - nextRun.getDay()) % 7));
    nextRun.setHours(reminderTime.getHours(), reminderTime.getMinutes(), 0, 0);

    return nextRun;
  }

  /**
   * Shutdown the notification service
   * Stops all scheduled jobs and clears the map
   */
  static async shutdown() {
    // Stop all scheduled jobs
    this.scheduledNotifications.forEach(jobs => {
      jobs.forEach(job => {
        job.cronJob.stop();
      });
    });

    // Clear the map
    this.scheduledNotifications.clear();

    console.log('Notification service shut down successfully');
  }
}
