import { NextFunction, Response } from 'express';
import { Schedule } from '../models/schedule.js';

export class ScheduleController {
  // Create a new reading schedule
  static async CreateSchedule(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const schedule = new Schedule({
        userId: req.user._id,
        ...req.body,
      });
      await schedule.validate();
      await schedule.save();
      res.status(201).json(schedule);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all schedules for a user
  static async FetchSchedules(req: any, res: Response): Promise<void> {
    try {
      const schedules = await Schedule.find({
        userId: req.user._id,
        isActive: true,
      }).sort({ startTime: 1 });
      res.json(schedules);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update a schedule
  static async UpdateSchedule(req: any, res: Response): Promise<void> {
    try {
      const schedule = await Schedule.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true, runValidators: true },
      );
      if (!schedule) {
        res.status(404).json({ error: 'Schedule not found' });
      }
      res.json(schedule);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a schedule (soft delete)
  static async DeleteSchedule(req: any, res: Response): Promise<void> {
    try {
      const schedule = await Schedule.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { isActive: false },
        { new: true },
      );
      if (!schedule) {
        res.status(404).json({ error: 'Schedule not found' });
      }
      res.json({ message: 'Schedule deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
