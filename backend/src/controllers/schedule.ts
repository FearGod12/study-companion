// src/controllers/ScheduleApi.ts
import { NextFunction, Response } from 'express';
import { ScheduleService } from '../services/schedule.js';
import { CustomError } from '../utils/customError.js';
import { createScheduleSchema, updateScheduleSchema } from '../utils/validators/schedule.js';
import { makeResponse } from '../utils/makeResponse.js';
import { combineDateAndTime, isDateInPast } from '../utils/timezone.js';

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

      // combine the date and time and be sure that it is not in the past
      const scheduleStartTime = combineDateAndTime(startDate, startTime);
      if (isDateInPast(scheduleStartTime)) {
        throw new CustomError(400, 'Start time cannot be in the past');
      }

      const schedule = await ScheduleService.createSchedule(req.user.id, {
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
      const schedules = await ScheduleService.getSchedules(req.user.id);
      res.json(makeResponse(true, 'schedules retrieved successfully', schedules));
    } catch (error: any) {
      next(error);
    }
  }

  static async updateSchedule(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, startTime, duration, startDate, isRecurring, recurringDays } = req.body;
      const updateData: { [key: string]: any } = {
        title,
        startTime,
        startDate,
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

      // console.log('updateData', updateData);


      const schedule = await ScheduleService.updateSchedule(req.user.id, req.params.id, updateData);

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
      await ScheduleService.deleteSchedule(req.user.id, req.params.id);
      res.json(makeResponse(true, 'Schedule deleted successfully', null));
    } catch (error: any) {
      next(error);
    }
  }
}
