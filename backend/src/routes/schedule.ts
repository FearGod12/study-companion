// src/routes/schedule.ts
import express from 'express';
import { ScheduleController } from '../controllers/schedule.js';
import isAuthenticated from '../middlewares/loginRequired.js';

const scheduleRouter = express.Router();

// Create a new reading schedule
scheduleRouter.post('/', isAuthenticated, ScheduleController.CreateSchedule);

// Get all schedules for a user
scheduleRouter.get('/', isAuthenticated, ScheduleController.FetchSchedules);

// Update a schedule
scheduleRouter.put('/:id', isAuthenticated, ScheduleController.UpdateSchedule);

// Delete a schedule (soft delete)
scheduleRouter.delete('/:id', isAuthenticated, ScheduleController.DeleteSchedule);

export default scheduleRouter;
