import { Agenda } from 'agenda';
import { Schedule } from '../models/schedule.js';
import { EmailSubject, sendMail } from '../utils/sendMail.js';
export class NotificationService {
    static agenda;
    static async init() {
        // Initialize agenda with your MongoDB connection
        this.agenda = new Agenda({
            db: {
                address: process.env.MONGODB_URI,
                collection: 'agendaJobs',
            },
            processEvery: '1 minute',
        });
        // Define job processors
        this.agenda.define('send-reading-reminder', async (job) => {
            const { scheduleId, minutes } = job.attrs.data;
            try {
                const schedule = await Schedule.findById(scheduleId).populate('userId');
                if (!schedule || !schedule.isActive) {
                    return;
                }
                await sendMail(EmailSubject.VerifyEmail, 'reading-reminder', {
                    user: schedule.userId,
                    title: schedule.title,
                    minutes: minutes,
                });
            }
            catch (error) {
                console.error('Failed to process reminder:', error);
            }
        });
        // Start processing jobs
        await this.agenda.start();
    }
    static async scheduleNotifications(scheduleId) {
        const schedule = await Schedule.findById(scheduleId);
        if (!schedule || !schedule.isActive)
            return;
        const thirtyMinReminder = new Date(schedule.startTime.getTime() - 30 * 60000);
        const fiveMinReminder = new Date(schedule.startTime.getTime() - 5 * 60000);
        // Schedule 30-minute reminder
        await this.agenda.schedule(thirtyMinReminder, 'send-reading-reminder', {
            scheduleId: schedule._id,
            minutes: 30,
        });
        // Schedule 5-minute reminder
        await this.agenda.schedule(fiveMinReminder, 'send-reading-reminder', {
            scheduleId: schedule._id,
            minutes: 5,
        });
        // Handle recurring schedules
        if (schedule.isRecurring && schedule.recurringDays) {
            await this.scheduleRecurringNotifications(schedule);
        }
    }
    static async scheduleRecurringNotifications(schedule) {
        // Calculate next occurrence for each recurring day
        for (const dayOfWeek of schedule.recurringDays) {
            const nextOccurrence = this.calculateNextOccurrence(schedule.startTime, dayOfWeek);
            if (nextOccurrence) {
                const thirtyMinReminder = new Date(nextOccurrence.getTime() - 30 * 60000);
                const fiveMinReminder = new Date(nextOccurrence.getTime() - 5 * 60000);
                // Use a unique name for recurring jobs
                const jobName = `recurring-reminder-${schedule._id}-${dayOfWeek}`;
                // Schedule 30-minute recurring reminder
                await this.agenda.every('1 week', 'send-reading-reminder', {
                    scheduleId: schedule._id,
                    minutes: 30,
                }, {
                    timezone: 'UTC',
                    skipImmediate: true,
                    startDate: thirtyMinReminder,
                });
                // Schedule 5-minute recurring reminder
                await this.agenda.every('1 week', 'send-reading-reminder', {
                    scheduleId: schedule._id,
                    minutes: 5,
                }, {
                    timezone: 'UTC',
                    skipImmediate: true,
                    startDate: fiveMinReminder,
                });
            }
        }
    }
    static calculateNextOccurrence(startTime, dayOfWeek) {
        const result = new Date(startTime);
        result.setDate(result.getDate() + ((7 + dayOfWeek - result.getDay()) % 7));
        return result;
    }
    static async cancelNotifications(scheduleId) {
        // Cancel all jobs related to this schedule
        await this.agenda.cancel({
            'data.scheduleId': scheduleId,
        });
    }
    static async shutdown() {
        // Properly shut down agenda when the server is stopping
        if (this.agenda) {
            await this.agenda.stop();
        }
    }
}
