import express from 'express';
import { PaystackWebhookController } from '../controllers/paystack-webhook.js';

const router = express.Router();
const paystackWebhookController = new PaystackWebhookController();

/**
 * @swagger
 * /api/webhook/paystack:
 *   post:
 *     summary: Handle Paystack webhook events
 *     description: Process webhook events from Paystack for subscription and one-time charge events
 *     tags: [Webhooks]
 *     security:
 *       - PaystackSignature: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: The type of event (e.g., charge.success, subscription.disable, invoice.create, invoice.update, invoice.payment_succeeded, invoice.payment_failed)
 *                 example: subscription.disable
 *               data:
 *                 type: object
 *                 description: The event data
 *                 example:
 *                   domain: test
 *                   status: complete
 *                   subscription_code: SUB_vsyqdmlzble3uii
 *                   email_token: ctt824k16n34u69
 *                   amount: 300000
 *                   cron_expression: 0 * * * *
 *                   next_payment_date: 2020-11-26T15:00:00.000Z
 *                   open_invoice: null
 *                   plan:
 *                     id: 67572
 *                     name: Monthly retainer
 *                     plan_code: PLN_gx2wn530m0i3w3m
 *                     description: null
 *                     amount: 50000
 *                     interval: monthly
 *                     send_invoices: true
 *                     send_sms: true
 *                     currency: NGN
 *                   authorization:
 *                     authorization_code: AUTH_96xphygz
 *                     bin: 539983
 *                     last4: 7357
 *                     exp_month: 10
 *                     exp_year: 2017
 *                     card_type: MASTERCARD DEBIT
 *                     bank: GTBANK
 *                     country_code: NG
 *                     brand: MASTERCARD
 *                     account_name: BoJack Horseman
 *                   customer:
 *                     first_name: BoJack
 *                     last_name: Horseman
 *                     email: bojack@horsinaround.com
 *                     customer_code: CUS_xnxdt6s1zg1f4nx
 *                     phone: ""
 *                     metadata: {}
 *                     risk_action: default
 *                   created_at: 2020-11-26T14:45:06.000Z
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid request or missing signature
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/', paystackWebhookController.handleWebhook.bind(paystackWebhookController));

export default router;
