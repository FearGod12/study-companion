import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { CustomError } from '../utils/customError.js';
import prisma from '../config/prisma.js';

export class PaystackWebhookController {
  private prisma;
  private readonly PAYSTACK_SECRET_KEY: string;

  constructor() {
    this.prisma = prisma;
    this.PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

    if (!this.PAYSTACK_SECRET_KEY) {
      throw new Error('PAYSTACK_SECRET_KEY is not defined');
    }
  }

  /**
   * Verify the authenticity of the Paystack webhook
   */
  private verifyPaystackWebhook(signature: string, requestBody: string): boolean {
    const hash = crypto
      .createHmac('sha512', this.PAYSTACK_SECRET_KEY)
      .update(requestBody)
      .digest('hex');

    return hash === signature;
  }

  /**
   * Handle subscription events from Paystack
   */
  private async handleSubscriptionEvent(event: any) {
    const { customer, subscription } = event.data;

    if (!customer || !customer.email) {
      throw new CustomError(400, 'Invalid customer data');
    }

    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: customer.email },
    });

    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    // Update user's premium status based on subscription status
    const isPremium = subscription.status === 'active';

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isPremium },
    });

    // Log the subscription event
    await this.prisma.subscriptionEvent.create({
      data: {
        userId: user.id,
        eventType: event.type,
        status: subscription.status,
        amount: subscription.amount / 100, // Convert from kobo to naira
        currency: subscription.currency || 'NGN',
        metadata: event.data,
      },
    });

    return { success: true, message: 'Subscription event processed successfully' };
  }

  /**
   * Handle subscription disable events from Paystack
   */
  private async handleSubscriptionDisabledEvent(event: any, data: any) {
    const { customer, subscription_code, amount, plan } = data;

    if (!customer || !customer.email) {
      throw new CustomError(400, 'Invalid customer data');
    }

    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: customer.email },
    });

    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    // Set user's premium status to false when subscription is disabled
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isPremium: false },
    });

    // Log the subscription event
    await this.prisma.subscriptionEvent.create({
      data: {
        userId: user.id,
        eventType: event,
        status: 'disabled',
        amount: amount / 100, // Convert from kobo to naira
        currency: plan.currency || 'NGN',
        metadata: data,
      },
    });

    return { success: true, message: 'Subscription disabled event processed successfully' };
  }

  /**
   * Handle invoice events from Paystack
   */
  private async handleInvoiceEvent(event: any, data: any) {
    console.log('handling invoice event');
    const { customer, subscription, transaction, paid, invoice_code } = data;

    if (!customer || !customer.email) {
      throw new CustomError(400, 'Invalid customer data');
    }

    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: customer.email },
    });

    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    // Update user's premium status based on subscription status
    const isPremium = subscription.status === 'active' && paid === true;

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isPremium },
    });

    // Log the invoice event
    await this.prisma.subscriptionEvent.create({
      data: {
        userId: user.id,
        eventType: event,
        status: subscription.status,
        amount: subscription.amount / 100, // Convert from kobo to naira
        currency: transaction.currency || 'NGN',
        metadata: data,
      },
    });

    await this.prisma.transactions.create({
      data: {
        userId: user.id,
        amount: subscription.amount / 100,
        currency: transaction.currency || 'NGN',
        invoiceCode: invoice_code,
      },
    });

    return { success: true, message: 'Invoice event processed successfully' };
  }

  /**
   * Handle one-time charge events from Paystack
   */
  private async handleChargeEvent(event: any, data: any) {
    const { customer, amount, currency, reference } = data;

    if (!customer || !customer.email) {
      throw new CustomError(400, 'Invalid customer data');
    }

    console.log('handling charge event');
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: customer.email },
    });
    console.log('user found');
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    // For successful charges, set the user as premium
    if (data.status === 'success') {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isPremium: true },
      });
      console.log('user updated to premium');

      // Log the charge event
      await this.prisma.subscriptionEvent.create({
        data: {
          userId: user.id,
          eventType: event,
          status: 'success',
          amount: amount / 100, // Convert from kobo to naira
          currency: currency,
          metadata: data,
        },
      });
      console.log('subscription event created');
    }
    await this.prisma.transactions.create({
      data: {
        userId: user.id,
        amount: amount / 100,
        currency: currency,
        reference: reference,
      },
    });
    console.log('transaction created');
    return { success: true, message: 'Charge event processed successfully' };
  }

  /**
   * Main webhook handler
   */
  public async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      // Verify the webhook signature
      const signature = req.headers['x-paystack-signature'] as string;
      if (!signature) {
        throw new CustomError(400, 'Missing Paystack signature');
      }

      const isValid = this.verifyPaystackWebhook(signature, JSON.stringify(req.body));
      if (!isValid) {
        throw new CustomError(400, 'Invalid Paystack signature');
      }
      const { event, data } = req.body;

      console.log(event);
      console.log(data);

      // Handle different event types
      switch (event) {
        case 'charge.success':
          await this.handleChargeEvent(event, data);
          return res.sendStatus(200);

        case 'invoice.update':
        case 'invoice.payment_failed':
          await this.handleInvoiceEvent(event, data);
          return res.sendStatus(200);

        case 'subscription.disable':
          await this.handleSubscriptionDisabledEvent(event, data);
          return res.sendStatus(200);

        default:
          return res.sendStatus(200);
      }
    } catch (error) {
      console.error('Paystack webhook error:', error);

      next(error);
    }
  }
}
