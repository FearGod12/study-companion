import express from 'express';
import { ScheduleController } from '../controllers/schedule.js';
import isAuthenticated from '../middlewares/loginRequired.js';
const scheduleRouter = express.Router();
/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Create a new schedule
 *     tags:
 *       - Schedules
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the schedule
 *                 example: "Morning Study Session"
 *               startDate:
 *                 type: string
 *                 description: Start date of the schedule in YYYY-MM-DD format
 *                 example: "2024-12-01"
 *               startTime:
 *                 type: string
 *                 description: Start time of the schedule in HH:MM:SS format
 *                 example: "08:00:00"
 *               duration:
 *                 type: integer
 *                 description: Duration of the session in minutes
 *                 example: 60
 *               isRecurring:
 *                 type: boolean
 *                 description: Whether the schedule is recurring
 *                 example: true
 *               recurringDays:
 *                 type: array
 *                 description: Days of the week for recurring schedules (0 for Sunday through 6 for Saturday)
 *                 items:
 *                   type: integer
 *                   minimum: 0
 *                   maximum: 6
 *                 example: [1, 3, 5] # Example for recurring on Monday, Wednesday, and Friday
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the created schedule
 *                   example: "61e8a7d8f6f6a76d88d9f8a2"
 *                 title:
 *                   type: string
 *                   description: Title of the schedule
 *                   example: "Morning Study Session"
 *                 startTime:
 *                   type: string
 *                   description: Combined start date and time of the schedule
 *                   example: "2024-12-01T08:00:00"
 *                 duration:
 *                   type: integer
 *                   description: Duration of the session in minutes
 *                   example: 60
 *                 isRecurring:
 *                   type: boolean
 *                   description: Whether the schedule is recurring
 *                   example: true
 *                 recurringDays:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [1, 3, 5]
 *       400:
 *         description: Invalid input
 */
scheduleRouter.post('/', isAuthenticated, ScheduleController.createSchedule);
/**
 * @swagger
 * /schedules:
 *   get:
 *     summary: Retrieve all schedules
 *     tags:
 *       - Schedules
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   date:
 *                     type: string
 */
scheduleRouter.get('/', isAuthenticated, ScheduleController.getSchedules);
/**
 * @swagger
 * /schedules/{id}:
 *   put:
 *     summary: Update a schedule
 *     tags:
 *       - Schedules
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the schedule
 *                 example: "Updated Study Session"
 *               startDate:
 *                 type: string
 *                 description: Updated start date in YYYY-MM-DD format
 *                 example: "2024-12-15"
 *               startTime:
 *                 type: string
 *                 description: Updated start time in HH:MM:SS format
 *                 example: "09:30:00"
 *               duration:
 *                 type: integer
 *                 description: Updated duration of the session in minutes
 *                 example: 90
 *               isRecurring:
 *                 type: boolean
 *                 description: Whether the schedule is recurring
 *                 example: true
 *               recurringDays:
 *                 type: array
 *                 description: Updated days of the week for recurring schedules (0 for Sunday through 6 for Saturday)
 *                 items:
 *                   type: integer
 *                   minimum: 0
 *                   maximum: 6
 *                 example: [1, 3, 5]
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       404:
 *         description: Schedule not found
 */
scheduleRouter.put('/:id', isAuthenticated, ScheduleController.updateSchedule);
/**
 * @swagger
 * /schedules/{id}:
 *   delete:
 *     summary: Delete a schedule
 *     tags:
 *       - Schedules
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The schedule ID
 *     responses:
 *       204:
 *         description: Schedule deleted successfully
 *       404:
 *         description: Schedule not found
 */
scheduleRouter.delete('/:id', isAuthenticated, ScheduleController.deleteSchedule);
export default scheduleRouter;
