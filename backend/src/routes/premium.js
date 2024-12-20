import express from 'express';
import isAuthenticated from '../middlewares/loginRequired.js';
import { PremiumController } from '../controllers/premium.js';
const premiumRouter = express.Router();
/**
 * @swagger
 * /premium/go-premium:
 *   get:
 *     summary: Subscribe to premium service
 *     description: Allows authenticated users to upgrade to premium subscription
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription URL generated
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
 *                   example: Subscription URL generated
 *                 data:
 *                   type: object
 *                   properties:
 *                     subscription_url:
 *                       type: string
 *                       example: https://paystack.com/subscription/123456
 *
 *       401:
 *         description: Unauthorized - User not authenticated
 *       500:
 *         description: Internal server error
 */
premiumRouter.get('/go-premium', isAuthenticated, PremiumController.subscribe);
export default premiumRouter;
