import { Agenda } from 'agenda';
import { Schedule } from '../models/schedule.js';
import { EmailSubject, sendMail } from '../utils/sendMail.js';
export class NotificationService {
    static agenda;
    static JOB_NAME = 'send-reading-reminder';
    static REMINDER_TIMES = [30, 5]; // minutes before start
    static async init() {
        try {
            this.agenda = new Agenda({
                db: {
                    address: process.env.MONGODB_URL,
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
        }
        catch (error) {
            console.error('Failed to initialize notification service:', error);
            throw error;
        }
    }
    static setupJobProcessor() {
        this.agenda.define(this.JOB_NAME, { priority: 10, concurrency: 10 }, async (job) => {
            const { scheduleId, minutes } = job.attrs.data;
            try {
                const schedule = await Schedule.findById(scheduleId)
                    .populate('userId')
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
                await sendMail(EmailSubject.VerifyEmail, 'reading-reminder', {
                    user: schedule.userId,
                    title: schedule.title,
                    minutes: minutes,
                });
                console.log(`Reminder sent for schedule ${scheduleId} (${minutes} minutes)`);
            }
            catch (error) {
                console.error('Failed to process reminder:', error);
                throw error; // Let Agenda handle the retry
            }
        });
    }
    static setupEventHandlers() {
        this.agenda.on('fail', (err, job) => {
            console.error(`Job ${job.attrs.name} failed:`, err);
            // Implement error reporting (e.g., to Sentry)
        });
        this.agenda.on('success', (job) => {
            console.log(`Job ${job.attrs.name} completed successfully`);
        });
    }
    static async setupCleanupJob() {
        this.agenda.define('cleanup-old-jobs', async () => {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            await this.agenda.cancel({
                lastFinishedAt: { $lt: thirtyDaysAgo },
            });
        });
        await this.agenda.every('24 hours', 'cleanup-old-jobs');
    }
    static async scheduleNotifications(scheduleId) {
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
        }
        catch (error) {
            console.error(`Failed to schedule notifications for ${scheduleId}:`, error);
            throw error;
        }
    }
    static async scheduleOneTimeNotifications(schedule) {
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
    static async scheduleRecurringNotifications(schedule) {
        for (const dayOfWeek of schedule.recurringDays) {
            const nextOccurrence = this.calculateNextOccurrence(schedule.startTime, dayOfWeek);
            if (!nextOccurrence) {
                console.log(`Invalid next occurrence for schedule ${schedule._id} day ${dayOfWeek}`);
                continue;
            }
            for (const minutes of this.REMINDER_TIMES) {
                const reminderTime = new Date(nextOccurrence.getTime() - minutes * 60000);
                const jobName = `${this.JOB_NAME}-${schedule._id}-${dayOfWeek}-${minutes}`;
                await this.agenda.every('1 week', jobName, {
                    scheduleId: schedule._id,
                    minutes,
                }, {
                    timezone: 'Africa/Lagos', // More precise than UTC+1
                    skipImmediate: true,
                    startDate: reminderTime,
                });
            }
        }
    }
    static calculateNextOccurrence(startTime, dayOfWeek) {
        if (dayOfWeek < 0 || dayOfWeek > 6) {
            console.error(`Invalid day of week: ${dayOfWeek}`);
            return null;
        }
        const result = new Date(startTime);
        result.setDate(result.getDate() + ((7 + dayOfWeek - result.getDay()) % 7));
        return result;
    }
    static async cancelNotifications(scheduleId) {
        try {
            const jobs = await this.agenda.jobs({
                'data.scheduleId': scheduleId,
            });
            console.log(`Cancelling ${jobs.length} notifications for schedule ${scheduleId}`);
            await this.agenda.cancel({
                'data.scheduleId': scheduleId,
            });
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('Error shutting down notification service:', error);
            throw error;
        }
    }
}
