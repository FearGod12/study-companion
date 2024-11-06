import express from 'express';
import { ReadingSessionController } from '../controllers/reading-session.js';
import isAuthenticated from '../middlewares/loginRequired.js';

const readingSessionRouter = express.Router();

// Start a reading session
readingSessionRouter.post('/start', isAuthenticated, ReadingSessionController.startSession);

// Check-in for an active session
readingSessionRouter.post('/check-in', isAuthenticated, ReadingSessionController.checkIn);

// End a reading session
readingSessionRouter.post('/end', isAuthenticated, ReadingSessionController.endSession);

export default readingSessionRouter;
