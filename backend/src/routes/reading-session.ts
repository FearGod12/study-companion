import express from 'express';
import { ReadingSessionController } from '../controllers/reading-session.js';
import isAuthenticated from '../middlewares/loginRequired.js';

const studySessionRouter = express.Router();


/**
 * @swagger
 * /study-sessions/{scheduleId}/start:
 *   post:
 *     summary: Start a new reading session
 *     tags:
 *       - Study Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the schedule for the reading session
 *     responses:
 *       201:
 *         description: Study session started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'study session started successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier for the reading session
 *                       example: "61e8a7d8f6f6a76d88d9f8a2"
 *                     userId:
 *                       type: string
 *                       description: ID of the user who started the session
 *                     scheduleId:
 *                       type: string
 *                       description: ID of the associated schedule
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the session started
 *                     status:
 *                       type: string
 *                       enum: ['active', 'completed', 'interrupted']
 *                       description: Current status of the reading session
 *       200:
 *         description: Existing study session retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'study session started successfully'
 *                 data:
 *                   $ref: '#/components/schemas/ReadingSession'
 *       400:
 *         description: Bad request (e.g., invalid schedule)
 *       404:
 *         description: Schedule not found
 *       409:
 *         description: Another session is currently active
 */
studySessionRouter.post('/:scheduleId/start', isAuthenticated, ReadingSessionController.startSession);

/**
 * @swagger
 * /study-sessions/{scheduleId}/check-in:
 *   post:
 *     summary: Check-in for an active reading session
 *     tags:
 *       - Study Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the schedule for the active session
 *     responses:
 *       200:
 *         description: Check-in recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'checkin recorded'
 *                 data:
 *                   $ref: '#/components/schemas/ReadingSession'
 *       404:
 *         description: No active session found
 */
studySessionRouter.post('/:scheduleId/check-in', isAuthenticated, ReadingSessionController.checkIn);

/**
 * @swagger
 * /study-sessions/{scheduleId}/end:
 *   post:
 *     summary: End an active reading session
 *     tags:
 *       - Study Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the schedule for the active session
 *     responses:
 *       200:
 *         description: Session ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'session ended successfully'
 *                 data:
 *                   $ref: '#/components/schemas/ReadingSession'
 *       404:
 *         description: No active session found
 *       409:
 *         description: Session is not in an active state
 */
studySessionRouter.post('/:scheduleId/end', isAuthenticated, ReadingSessionController.endSession);

/**
 * @swagger
 * /study-sessions:
 *   get:
 *     summary: Retrieve all user's reading sessions with pagination
 *     tags:
 *       - Study Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for paginated results
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved reading sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'All sessions retrieved'
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ReadingSession'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *                         totalItems:
 *                           type: integer
 *                           example: 50
 *                         itemsPerPage:
 *                           type: integer
 *                           example: 10
 *       401:
 *         description: Unauthorized, authentication token is missing or invalid
 */
studySessionRouter.get('/', isAuthenticated, ReadingSessionController.getAllSessions);

/**
 * @swagger
 * /study-sessions/statistics:
 *   get:
 *     summary: Retrieve user's reading session statistics
 *     tags:
 *       - Study Sessions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'User statistics retrieved successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalMinutesStudied:
 *                       type: number
 *                       description: Total minutes studied across all sessions
 *                       example: 360
 *                     totalSessionsCompleted:
 *                       type: number
 *                       description: Total number of completed study sessions
 *                       example: 12
 *                     longestSessionDuration:
 *                       type: number
 *                       description: Duration of the longest study session in minutes
 *                       example: 90
 *                     averageSessionDuration:
 *                       type: number
 *                       description: Average duration of study sessions in minutes
 *                       example: 30
 *                     currentStreak:
 *                       type: number
 *                       description: Current consecutive days with at least one study session
 *                       example: 5
 *                     longestStreak:
 *                       type: number
 *                       description: Longest streak of consecutive days with study sessions
 *                       example: 7
 */
studySessionRouter.get('/statistics', isAuthenticated, ReadingSessionController.getUserStatistics);

/**
 * @swagger
 * components:
 *   schemas:
 *     ReadingSession:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the reading session
 *           example: "61e8a7d8f6f6a76d88d9f8a2"
 *         userId:
 *           type: string
 *           description: ID of the user who started the session
 *           example: "60d5ecb8b3b3a83c98f3e2a1"
 *         scheduleId:
 *           type: string
 *           description: ID of the schedule associated with the session
 *           example: "62f8a7d8f6f6a76d88d9f8b3"
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the session started
 *           example: "2024-01-15T08:00:00Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the session ended
 *           example: "2024-01-15T09:00:00Z"
 *         lastCheckIn:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the last check-in
 *           example: "2024-01-15T08:30:00Z"
 *         duration:
 *           type: integer
 *           description: Actual duration of the session in minutes
 *           example: 60
 *         status:
 *           type: string
 *           enum: ['active', 'completed', 'interrupted']
 *           description: Current status of the reading session
 *           example: "completed"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default studySessionRouter;
