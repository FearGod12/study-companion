import { ScheduleService } from '../services/schedule.js';
import { CustomError } from '../utils/customError.js';
import { validationScheduleSchema } from '../utils/validators/schedule.js';
export class ScheduleController {
    static async createSchedule(req, res, next) {
        try {
            const { error } = validationScheduleSchema.validate(req.body);
            if (error) {
                throw new CustomError(400, error.details[0].message);
            }
            const schedule = await ScheduleService.createSchedule(req.user._id, req.body);
            res.status(201).json(schedule);
        }
        catch (error) {
            throw new CustomError(500, error.message);
        }
    }
    static async getSchedules(req, res, next) {
        try {
            const schedules = await ScheduleService.getSchedules(req.user._id);
            res.json(schedules);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async updateSchedule(req, res, next) {
        try {
            const schedule = await ScheduleService.updateSchedule(req.user._id, req.params.id, req.body);
            if (!schedule) {
                throw new CustomError(404, 'Schedule not found');
            }
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async deleteSchedule(req, res, next) {
        try {
            await ScheduleService.deleteSchedule(req.user._id, req.params.id);
            res.json({ message: 'Schedule deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
