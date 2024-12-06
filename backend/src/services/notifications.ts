import mongoose from 'mongoose';
import cron from 'node-cron';
import { ISchedule, Schedule } from '../models/schedule.js';
import User, { IUser } from '../models/users.js';
import { EmailSubject, sendMail } from '../utils/sendMail.js';

// Mongoose Schema for Scheduled Notifications
const ScheduledNotificationSchema = new mongoose.Schema({
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true,
  },
  minutesBefore: {
    type: Number,
    required: true,
  },
  scheduledFor: {
    type: Date,
    required: true,
  },
  isExecuted: {
    type: Boolean,
    default: false,
  },
  cronJobId: {
    type: String,
    required: true,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringDayOfWeek: {
    type: Number,
    required: false,
  },
});

const ScheduledNotification = mongoose.model('ScheduledNotification', ScheduledNotificationSchema);

// Interface for Scheduled Notification Jobs
interface ScheduledNotificationJob {
  scheduleId: string;
  cronJob: cron.ScheduledTask;
}

export class NotificationService {
  // In-memory storage of currently active cron jobs
  private static scheduledNotifications: Map<string, ScheduledNotificationJob[]> = new Map();

  // Reminder times in minutes before the event
  private static readonly REMINDER_TIMES = [30, 5] as const;

  // Timezone for scheduling
  private static readonly TIMEZONE = 'Africa/Lagos';

  /**
   * Initialize the notification service
   * Recovers and re-schedules any pending notifications
   */
  static async init() {
    console.log('Notification service initialized');

    try {
      // Find all active schedules
      const activeSchedules = await Schedule.find({ isActive: true });

      // Find pending scheduled notifications
      const pendingNotifications = await ScheduledNotification.find({
        isExecuted: false,
        scheduledFor: { $gt: new Date() },
      }).populate<{ scheduleId: ISchedule }>('scheduleId');

      // Re-schedule notifications for each pending notification
      for (const notification of pendingNotifications) {
        const schedule = notification.scheduleId;

        if (schedule && schedule.isActive) {
          await this.scheduleNotifications(schedule._id.toString());
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

      const schedule = await Schedule.findById(scheduleId)
        .populate<{ userId: IUser }>('userId')
        .lean();

      if (!schedule || !schedule.isActive) {
        console.log(`Schedule ${scheduleId} not found or inactive`);
        return;
      }

      // Schedule one-time notifications
      await this.scheduleOneTimeNotifications(schedule as unknown as ISchedule);

      // Handle recurring schedules
      if (schedule.isRecurring && schedule.recurringDays?.length) {
        await this.scheduleRecurringNotifications(schedule as unknown as ISchedule);
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
  private static async scheduleOneTimeNotifications(schedule: ISchedule) {
    const scheduledJobs: ScheduledNotificationJob[] = [];

    for (const minutes of this.REMINDER_TIMES) {
      const reminderTime = new Date(schedule.startTime.getTime() - minutes * 60000);

      // Don't schedule if the reminder time is in the past
      if (reminderTime.getTime() <= Date.now()) {
        console.log(`Skipping ${minutes}min reminder for past schedule ${schedule._id}`);
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
            await ScheduledNotification.findOneAndUpdate(
              {
                scheduleId: schedule._id,
                minutesBefore: minutes,
                isRecurring: false,
              },
              { isExecuted: true }
            );

            // Remove the job after it's executed
            job.stop();
          } catch (error) {
            console.error(`Error sending reminder for schedule ${schedule._id}:`, error);
          }
        },
        {
          scheduled: true,
          timezone: this.TIMEZONE,
        }
      );

      // Generate a unique identifier for the job
      const cronJobId = `${schedule._id}_${minutes}_${Date.now()}`;

      // Persist the scheduled notification in the database
      await ScheduledNotification.create({
        scheduleId: schedule._id,
        minutesBefore: minutes,
        scheduledFor: reminderTime,
        isExecuted: false,
        cronJobId: cronJobId,
        isRecurring: false,
      });

      scheduledJobs.push({
        scheduleId: schedule._id!.toString(),
        cronJob: job,
      });
    }

    // Store scheduled jobs
    this.scheduledNotifications.set(schedule._id!.toString(), scheduledJobs);
  }

  /**
   * Schedule recurring notifications for a schedule
   * @param schedule - Recurring schedule to create notifications for
   */
  private static async scheduleRecurringNotifications(schedule: ISchedule) {
    const scheduledJobs: ScheduledNotificationJob[] = [];

    for (const dayOfWeek of schedule.recurringDays!) {
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
              const currentSchedule = await Schedule.findById(schedule._id);
              if (!currentSchedule || !currentSchedule.isActive) {
                job.stop();
                return;
              }

              await this.sendReminderEmail(schedule, minutes);
            } catch (error) {
              console.error(
                `Error sending recurring reminder for schedule ${schedule._id}:`,
                error
              );
            }
          },
          {
            scheduled: true,
            timezone: this.TIMEZONE,
          }
        );

        // Generate a unique identifier for the job
        const cronJobId = `${schedule._id}_${dayOfWeek}_${minutes}_${Date.now()}`;

        // Persist the scheduled notification in the database
        await ScheduledNotification.create({
          scheduleId: schedule._id,
          minutesBefore: minutes,
          scheduledFor: this.calculateNextRun(schedule.startTime, dayOfWeek, minutes),
          isExecuted: false,
          cronJobId: cronJobId,
          isRecurring: true,
          recurringDayOfWeek: dayOfWeek,
        });

        scheduledJobs.push({
          scheduleId: schedule._id!.toString(),
          cronJob: job,
        });
      }
    }

    // Store or update scheduled jobs for this schedule
    this.scheduledNotifications.set(schedule._id!.toString(), scheduledJobs);
  }

  /**
   * Send a reminder email for a specific schedule
   * @param schedule - Schedule to send reminder for
   * @param minutes - Minutes before the schedule to send reminder
   */
  private static async sendReminderEmail(schedule: ISchedule, minutes: number) {
    const user = await User.findById(schedule.userId);
    if (!user) {
      console.error(`User not found for schedule ${schedule._id}`);
      return;
    }

    sendMail(EmailSubject.StudySessionReminder, 'reading-reminder', {
      user: user,
      title: schedule.title,
      minutes: minutes,
      startTime: schedule.startTime.toLocaleTimeString('en-NG', { timeZone: this.TIMEZONE }),
      duration: schedule.duration,
    });

    console.log(`Reminder sent for schedule ${schedule._id} (${minutes} minutes)`);
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
      await ScheduledNotification.deleteMany({
        scheduleId: scheduleId,
        isExecuted: false,
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

      const schedule = await Schedule.findById(scheduleId);
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
      const schedule = await Schedule.findById(scheduleId);
      if (!schedule) {
        return;
      }

      // If it's a one-time schedule, mark it inactive
      if (!schedule.isRecurring) {
        schedule.isActive = false;
        await schedule.save();
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
    const reminderTime = new Date(startTime.getTime() - minutesBefore * 60000);
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
    const reminderTime = new Date(startTime.getTime() - minutesBefore * 60000);
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
