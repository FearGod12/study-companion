import bodyParser from 'body-parser';
import chalk from 'chalk';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/errorHandler.js';
import rateLimiter from './middlewares/rateLimiter.js';
import swaggerSpec from './swagger/swaggerConfig.js';
import { makeResponse } from './utils/makeResponse.js';
const app = express();
app.set('trust proxy', 1);
app.use(rateLimiter);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// Routes
app.use((req, _res, next) => {
    if (req.url.startsWith('/docs')) {
        return next();
    }
    console.log(chalk.yellowBright(`Received ${req.method} request for ${req.url}`));
    next();
});
app.use((err, _req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send(makeResponse(false, 'Invalid JSON', null)); // Bad request
    }
    next(err);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
import router from './routes/users.js';
import scheduleRouter from './routes/schedule.js';
// Mount routes
app.use('/', router);
app.use('/schedules', scheduleRouter);
app.get('/api', async (_req, res, next) => {
    try {
        res.send(`Study Companion API is up and running`);
    }
    catch (error) {
        next(error);
    }
});
app.use(errorHandler);
export default app;
