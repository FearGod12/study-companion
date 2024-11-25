// src/controllers/ScheduleApi.ts
import { NextFunction, Response } from 'express';
import { ScheduleService } from '../services/schedule.js';
import { CustomError } from '../utils/customError.js';
import { createScheduleSchema, updateScheduleSchema } from '../utils/validators/schedule.js';
import { makeResponse } from '../utils/makeResponse.js';

export class ScheduleController {
  static async createSchedule(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, startTime, startDate, duration, isRecurring, recurringDays } = req.body;
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
    } catch (error: any) {
      next(error);
    }
  }

  static async getSchedules(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const schedules = await ScheduleService.getSchedules(req.user._id);
      res.json(makeResponse(true, 'schedules retrieved successfully', schedules));
    } catch (error: any) {
      next(error);
    }
  }

  static async updateSchedule(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, startTime, duration, isRecurring, recurringDays } = req.body;
      const updateData: { [key: string]: any } = {
        startTime,
        duration,
        isRecurring,
        recurringDays,
      };
      // remove undefined values from updateData
      Object.keys(updateData).forEach(
        key => updateData[key] === undefined && delete updateData[key]
      );
      const { error } = updateScheduleSchema.validate(updateData);
      if (error) {
        throw new CustomError(400, error.details[0].message);
      }
      const schedule = await ScheduleService.updateSchedule(
        req.user._id,
        req.params.id,
        updateData
      );
      if (!schedule) {
        throw new CustomError(404, 'Schedule not found');
      }
      res.json(makeResponse(true, 'Schedule updated successfully', schedule));
    } catch (error: any) {
      next(error);
    }
  }

  static async deleteSchedule(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      await ScheduleService.deleteSchedule(req.user._id, req.params.id);
      res.json({ message: 'Schedule deleted successfully' });
    } catch (error: any) {
      next(error);
    }
  }
}
