import { ScheduleService } from '../services/schedule.js';
import { CustomError } from '../utils/customError.js';
import { createScheduleSchema, updateScheduleSchema } from '../utils/validators/schedule.js';
import { makeResponse } from '../utils/makeResponse.js';
export class ScheduleController {
    static async createSchedule(req, res, next) {
        try {
            const { title, startTime, startDate, duration, isRecurring, recurringDays } = req.body;
            JSON.stringify;
            const { error } = createScheduleSchema.validate({
                title,
                startTime,
                startDate,
                duration,
                isRecurring,
                recurringDays,
            });
            if (error) {
                throw new CustomError(400, error.details[0].message);
            }
            const schedule = await ScheduleService.createSchedule(req.user._id, {
                title,
                startTime,
                startDate,
                duration,
                isRecurring,
                recurringDays,
            });
            res.status(201).json(makeResponse(true, 'study schedule created', schedule));
        }
        catch (error) {
            next(error);
        }
    }
    static async getSchedules(req, res, next) {
        try {
            const schedules = await ScheduleService.getSchedules(req.user._id);
            res.json(makeResponse(true, 'schedules retrieved successfully', schedules));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateSchedule(req, res, next) {
        try {
            const { title, startTime, duration, startDate, isRecurring, recurringDays } = req.body;
            const updateData = {
                title,
                startTime,
                startDate,
                duration,
                isRecurring,
                recurringDays,
            };
            // remove undefined values from updateData
            Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
            const { error } = updateScheduleSchema.validate(updateData);
            if (error) {
                throw new CustomError(400, error.details[0].message);
            }
            const schedule = await ScheduleService.updateSchedule(req.user._id, req.params.id, updateData);
            if (!schedule) {
                throw new CustomError(404, 'Schedule not found');
            }
            res.json(makeResponse(true, 'Schedule updated successfully', schedule));
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteSchedule(req, res, next) {
        try {
            await ScheduleService.deleteSchedule(req.user._id, req.params.id);
            res.json({ message: 'Schedule deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
