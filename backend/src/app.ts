import bodyParser from 'body-parser';
import chalk from 'chalk';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/errorHandler.js';
import swaggerSpec from './swagger/swaggerConfig.js';
import { makeResponse } from './utils/makeResponse.js';

import router from './routes/users.js';
import scheduleRouter from './routes/schedule.js';
import studySessionRouter from './routes/reading-session.js';

const app = express();

// Trust proxy for services like Render
app.set('trust proxy', 1);

// CORS Configuration
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://your-production-domain.com'], // Specify trusted origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.options('*', cors()); // Handle preflight requests globally

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.url.startsWith('/docs')) {
    return next();
  }
  console.log(chalk.yellowBright(`Received ${req.method} request for ${req.url}`));
  next();
});

// Invalid JSON handler
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    return res.status(400).send(makeResponse(false, 'Invalid JSON', null)); // Bad request
  }
  next(err);
});

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/', router);
app.use('/schedules', scheduleRouter);
app.use('/study-sessions', studySessionRouter);

// Health Check
app.get('/api', async (_req, res, next) => {
  try {
    res.send('Study Companion API is up and running');
  } catch (error) {
    next(error);
  }
});

// Global Error Handler
app.use(errorHandler);

export default app;
