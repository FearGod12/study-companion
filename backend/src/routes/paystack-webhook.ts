import express from 'express';
import { PaystackWebhookController } from '../controllers/paystack-webhook.js';

const router = express.Router();
const paystackWebhookController = new PaystackWebhookController();

/**
 * @swagger
 * /webhook/paystack:
 *   post:
 *     summary: Handle Paystack webhook events
 *     description: Process webhook events from Paystack, including subscription and one-time charge events
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: The type of event (e.g., charge.success, subscription.create, subscription.disable)
 *                 enum: [charge.success, invoice.payment_succeeded, subscription.disable, invoice.payment_failed]
 *               data:
 *                 type: object
 *                 description: The event data from Paystack
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook signature or data
 *       500:
 *         description: Internal server error
 */
router.post('/', (req, res, next) => paystackWebhookController.handleWebhook(req, res, next));

export default router;
