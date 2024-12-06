import cron from 'node-cron';
import { Schedule } from '../models/schedule.js';
import User from '../models/users.js';
import { EmailSubject, sendMail } from '../utils/sendMail.js';
export class NotificationService {
    static scheduledNotifications = new Map();
    static REMINDER_TIMES = [30, 5];
    static async init() {
        console.log('Notification service initialized');
        // Optional: You could add any startup logic here
    }
    static async scheduleNotifications(scheduleId) {
        try {
            // First, cancel any existing notifications for this schedule
            await this.cancelNotifications(scheduleId);
            const schedule = await Schedule.findById(scheduleId)
                .populate('userId')
                .lean();
            if (!schedule || !schedule.isActive) {
                console.log(`Schedule ${scheduleId} not found or inactive`);
                return;
            }
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
        const scheduledJobs = [];
        for (const minutes of this.REMINDER_TIMES) {
            const reminderTime = new Date(schedule.startTime.getTime() - minutes * 60000);
            // Don't schedule if the reminder time is in the past
            if (reminderTime.getTime() <= Date.now()) {
                console.log(`Skipping ${minutes}min reminder for past schedule ${schedule._id}`);
                continue;
            }
            // Create cron job
            const cronExpression = this.createCronExpression(reminderTime);
            const job = cron.schedule(cronExpression, async () => {
                try {
                    await this.sendReminderEmail(schedule, minutes);
                    // Remove the job after it's executed
                    job.stop();
                }
                catch (error) {
                    console.error(`Error sending reminder for schedule ${schedule._id}:`, error);
                }
            }, {
                scheduled: true,
                timezone: 'Africa/Lagos',
            });
            scheduledJobs.push({
                scheduleId: schedule._id.toString(),
                cronJob: job,
            });
        }
        // Store scheduled jobs
        this.scheduledNotifications.set(schedule._id.toString(), scheduledJobs);
    }
    static async scheduleRecurringNotifications(schedule) {
        const scheduledJobs = [];
        for (const dayOfWeek of schedule.recurringDays) {
            for (const minutes of this.REMINDER_TIMES) {
                // Calculate the cron expression for recurring reminders
                const cronExpression = this.createRecurringCronExpression(schedule.startTime, dayOfWeek, minutes);
                const job = cron.schedule(cronExpression, async () => {
                    try {
                        // Verify the schedule is still active and hasn't been deleted
                        const currentSchedule = await Schedule.findById(schedule._id);
                        if (!currentSchedule || !currentSchedule.isActive) {
                            job.stop();
                            return;
                        }
                        await this.sendReminderEmail(schedule, minutes);
                    }
                    catch (error) {
                        console.error(`Error sending recurring reminder for schedule ${schedule._id}:`, error);
                    }
                }, {
                    scheduled: true,
                    timezone: 'Africa/Lagos',
                });
                scheduledJobs.push({
                    scheduleId: schedule._id.toString(),
                    cronJob: job,
                });
            }
        }
        // Store or update scheduled jobs for this schedule
        this.scheduledNotifications.set(schedule._id.toString(), scheduledJobs);
    }
    static async sendReminderEmail(schedule, minutes) {
        const user = await User.findById(schedule.userId);
        if (!user) {
            console.error(`User not found for schedule ${schedule._id}`);
            return;
        }
        sendMail(EmailSubject.StudySessionReminder, 'reading-reminder', {
            user: user,
            title: schedule.title,
            minutes: minutes,
            startTime: schedule.startTime.toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos' }),
            duration: schedule.duration,
        });
        console.log(`Reminder sent for schedule ${schedule._id} (${minutes} minutes)`);
    }
    static async cancelNotifications(scheduleId) {
        const scheduledJobs = this.scheduledNotifications.get(scheduleId);
        if (scheduledJobs) {
            console.log(`Cancelling ${scheduledJobs.length} notifications for schedule ${scheduleId}`);
            scheduledJobs.forEach(job => {
                job.cronJob.stop();
            });
            // Remove the entry from the map
            this.scheduledNotifications.delete(scheduleId);
        }
    }
    static async updateSchedule(scheduleId) {
        try {
            // Cancel existing notifications
            await this.cancelNotifications(scheduleId);
            const schedule = await Schedule.findById(scheduleId);
            if (!schedule || !schedule.isActive) {
                return;
            }
            // Schedule new notifications
            await this.scheduleNotifications(scheduleId);
        }
        catch (error) {
            console.error(`Failed to update notifications for ${scheduleId}:`, error);
            throw error;
        }
    }
    static async markScheduleComplete(scheduleId) {
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
        }
        catch (error) {
            console.error(`Failed to mark schedule ${scheduleId} as complete:`, error);
            throw error;
        }
    }
    // Helper method to create a one-time cron expression
    static createCronExpression(reminderTime) {
        return `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`;
    }
    // Helper method to create a recurring cron expression
    static createRecurringCronExpression(startTime, dayOfWeek, minutesBefore) {
        const reminderTime = new Date(startTime.getTime() - minutesBefore * 60000);
        return `${reminderTime.getMinutes()} ${reminderTime.getHours()} * * ${dayOfWeek}`;
    }
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
