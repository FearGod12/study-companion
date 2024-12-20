import { rateLimit } from 'express-rate-limit';
const rateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 50, // Limit each IP to 50 requests per window (10 minutes)
    standardHeaders: 'draft-7', // `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
    handler: (_req, res, _next, options) => {
        res.status(429).json({ success: false, message: options.message.message, data: null });
    },
});
export default rateLimiter;
