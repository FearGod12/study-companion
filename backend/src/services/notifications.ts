import { Agenda, Job } from 'agenda';
import { ISchedule, Schedule } from '../models/schedule.js';
import { IUser } from '../models/users.js';
import { EmailSubject, sendMail } from '../utils/sendMail.js';

interface ReminderJobData {
  scheduleId: string;
  minutes: number;
  retryCount?: number;
}

export class NotificationService {
  private static agenda: Agenda;
  private static readonly JOB_NAME = 'send-reading-reminder';
  private static readonly REMINDER_TIMES = [30, 5] as const;
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 2 * 60 * 1000; // 2 minutes

  static async init() {
    try {
      this.agenda = new Agenda({
        db: {
          address: process.env.MONGODB_URL as string,
          collection: 'agendaJobs',
        },
        processEvery: '1 minute',
        defaultConcurrency: 5, // Limit concurrent job processing
        maxConcurrency: 20,
      });

      this.setupJobProcessor();
      this.setupEventHandlers();

      await this.agenda.start();

      // Clean up old jobs periodically
      await this.setupCleanupJob();

      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      throw error;
    }
  }
  private static setupJobProcessor() {
    this.agenda.define<ReminderJobData>(
      this.JOB_NAME,
      { priority: 10, concurrency: 10 },
      async (job: Job<ReminderJobData>) => {
        const { scheduleId, minutes, retryCount = 0 } = job.attrs.data;

        try {
          const schedule = await Schedule.findById(scheduleId)
            .populate<{ userId: IUser }>('userId')
            .lean();

          if (!schedule) {
            console.log(`Schedule ${scheduleId} not found, removing associated jobs`);
            await this.cancelNotifications(scheduleId);
            return;
          }

          if (!schedule.isActive) {
            console.log(`Schedule ${scheduleId} is inactive, skipping notification`);
            return;
          }

          // Check if it's too late to send the notification
          const now = new Date();
          const scheduleTime = new Date(schedule.startTime);
          if (scheduleTime.getTime() - now.getTime() < minutes * 60000) {
            console.log(`Too late to send ${minutes}min reminder for schedule ${scheduleId}`);
            return;
          }

          await sendMail(EmailSubject.VerifyEmail, 'reading-reminder', {
            user: schedule.userId,
            title: schedule.title,
            minutes: minutes,
            startTime: schedule.startTime.toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos' }),
            duration: schedule.duration,
          });

          console.log(`Reminder sent for schedule ${scheduleId} (${minutes} minutes)`);
        } catch (error) {
          console.error(`Failed to process reminder (attempt ${retryCount + 1}):`, error);

          if (retryCount < this.MAX_RETRIES) {
            // Schedule retry
            await this.agenda.schedule(new Date(Date.now() + this.RETRY_DELAY), this.JOB_NAME, {
              ...job.attrs.data,
              retryCount: retryCount + 1,
            });
          }

          throw error;
        }
      }
    );
  }
  private static setupEventHandlers() {
    this.agenda.on('fail', (err: Error, job: Job) => {
      console.error(`Job ${job.attrs.name} failed:`, err);
      // Implement error reporting (e.g., to Sentry)
    });

    this.agenda.on('success', (job: Job) => {
      console.log(`Job ${job.attrs.name} completed successfully`);
    });
  }

  private static async setupCleanupJob() {
    this.agenda.define('cleanup-old-jobs', async () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      await this.agenda.cancel({
        lastFinishedAt: { $lt: thirtyDaysAgo },
      });
    });

    await this.agenda.every('24 hours', 'cleanup-old-jobs');
  }

  static async scheduleNotifications(scheduleId: string) {
    try {
      const schedule = await Schedule.findById(scheduleId);
      if (!schedule || !schedule.isActive) {
        console.log(`Schedule ${scheduleId} not found or inactive`);
        return;
      }

      // Cancel any existing notifications for this schedule
      await this.cancelNotifications(scheduleId);

      // Schedule one-time notifications
      await this.scheduleOneTimeNotifications(schedule);

      // Handle recurring schedules
      if (schedule.isRecurring && schedule.recurringDays?.length) {
        await this.scheduleRecurringNotifications(schedule);
      }
    } catch (error) {
      console.error(`Failed to schedule notifications for ${scheduleId}:`, error);
      throw error;
    }
  }

  private static async scheduleOneTimeNotifications(schedule: ISchedule) {
    for (const minutes of this.REMINDER_TIMES) {
      const reminderTime = new Date(schedule.startTime.getTime() - minutes * 60000);

      // Don't schedule if the reminder time is in the past
      if (reminderTime.getTime() <= Date.now()) {
        console.log(`Skipping ${minutes}min reminder for past schedule ${schedule._id}`);
        continue;
      }

      await this.agenda.schedule(reminderTime, this.JOB_NAME, {
        scheduleId: schedule._id,
        minutes,
      });
    }
  }

  private static async scheduleRecurringNotifications(schedule: ISchedule) {
    for (const dayOfWeek of schedule.recurringDays!) {
      const nextOccurrence = this.calculateNextOccurrence(schedule.startTime, dayOfWeek);

      if (!nextOccurrence) {
        console.log(`Invalid next occurrence for schedule ${schedule._id} day ${dayOfWeek}`);
        continue;
      }

      for (const minutes of this.REMINDER_TIMES) {
        const reminderTime = new Date(nextOccurrence.getTime() - minutes * 60000);
        const jobName = `${this.JOB_NAME}-${schedule._id}-${dayOfWeek}-${minutes}`;

        await this.agenda.every(
          '1 week',
          jobName,
          {
            scheduleId: schedule._id,
            minutes,
          },
          {
            skipImmediate: true,
            startDate: reminderTime,
          }
        );
      }
    }
  }

  static async updateNotifications(scheduleId: string) {
    throw new Error('not yet implemented');
  }

  private static calculateNextOccurrence(startTime: Date, dayOfWeek: number): Date | null {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      console.error(`Invalid day of week: ${dayOfWeek}`);
      return null;
    }

    const result = new Date(startTime);
    result.setDate(result.getDate() + ((7 + dayOfWeek - result.getDay()) % 7));
    return result;
  }

  static async cancelNotifications(scheduleId: string) {
    try {
      const jobs = await this.agenda.jobs({
        'data.scheduleId': scheduleId,
      });

      console.log(`Cancelling ${jobs.length} notifications for schedule ${scheduleId}`);

      await this.agenda.cancel({
        'data.scheduleId': scheduleId,
      });
    } catch (error) {
      console.error(`Failed to cancel notifications for ${scheduleId}:`, error);
      throw error;
    }
  }

  static async shutdown() {
    try {
      if (this.agenda) {
        console.log('Shutting down notification service...');
        await this.agenda.stop();
        console.log('Notification service shut down successfully');
      }
    } catch (error) {
      console.error('Error shutting down notification service:', error);
      throw error;
    }
  }

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

  // Add method to handle study session completion
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

      // Could add logic here to track completion statistics
    } catch (error) {
      console.error(`Failed to mark schedule ${scheduleId} as complete:`, error);
      throw error;
    }
  }
}
