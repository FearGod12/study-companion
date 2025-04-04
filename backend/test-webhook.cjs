const crypto = require('crypto');
const axios = require('axios');

// Replace with your Paystack test secret key
const PAYSTACK_SECRET_KEY = 'sk_test_1063931d2a1dc0b87497fe22be953dd57f2f5017';

// Replace with your local server URL
const WEBHOOK_URL = 'http://localhost:3000/webhook/paystack';

// Example webhook payload for subscription.disable event
const webhookPayload = {
  event: 'subscription.disable',
  data: {
    domain: 'test',
    status: 'complete',
    subscription_code: 'SUB_vsyqdmlzble3uii',
    email_token: 'ctt824k16n34u69',
    amount: 300000,
    cron_expression: '0 * * * *',
    next_payment_date: '2025-11-26T15:00:00.000Z',
    open_invoice: null,
    plan: {
      id: 67572,
      name: 'Monthly retainer',
      plan_code: 'PLN_gx2wn530m0i3w3m',
      description: null,
      amount: 50000,
      interval: 'monthly',
      send_invoices: true,
      send_sms: true,
      currency: 'NGN',
    },
    authorization: {
      authorization_code: 'AUTH_96xphygz',
      bin: '539983',
      last4: '7357',
      exp_month: '10',
      exp_year: '2017',
      card_type: 'MASTERCARD DEBIT',
      bank: 'GTBANK',
      country_code: 'NG',
      brand: 'MASTERCARD',
      account_name: 'BoJack Horseman',
    },
    customer: {
      first_name: 'BoJack',
      last_name: 'Horseman',
      email: 'onyenikechukwudi@gmail.com',
      customer_code: 'CUS_xnxdt6s1zg1f4nx',
      phone: '',
      metadata: {},
      risk_action: 'default',
    },
    created_at: '2020-11-26T14:45:06.000Z',
  },
};

// Example webhook payload for charge.success event
const chargeSuccessPayload = {
  event: 'charge.success',
  data: {
    id: 302961,
    reference: 'ref_123456789',
    amount: 10000,
    channel: 'card',
    status: 'success',
    paid_at: '2020-11-26T14:45:06.000Z',
    customer: {
      id: 84312,
      first_name: 'BoJack',
      last_name: 'Horseman',
      email: 'onyenikechukwudi@gmail.com',
      customer_code: 'CUS_xnxdt6s1zg1f4nx',
      phone: '',
      metadata: {},
      risk_action: 'default',
    },
    authorization: {
      authorization_code: 'AUTH_96xphygz',
      bin: '539983',
      last4: '7357',
      exp_month: '10',
      exp_year: '2017',
      card_type: 'MASTERCARD DEBIT',
      bank: 'GTBANK',
      country_code: 'NG',
      brand: 'MASTERCARD',
      account_name: 'BoJack Horseman',
    },
    currency: 'NGN',
    metadata: {},
    fees: 100,
    paid_at: '2020-11-26T14:45:06.000Z',
    created_at: '2020-11-26T14:45:06.000Z',
  },
};

// Example webhook payload for invoice.create event
const invoiceCreatePayload = {
  event: 'invoice.create',
  data: {
    id: 12345,
    domain: 'test',
    status: 'pending',
    amount: 50000,
    currency: 'NGN',
    customer: {
      id: 84312,
      first_name: 'BoJack',
      last_name: 'Horseman',
      email: 'onyenikechukwudi@gmail.com',
      customer_code: 'CUS_xnxdt6s1zg1f4nx',
      phone: '',
      metadata: {},
      risk_action: 'default',
    },
    subscription: {
      id: 1234,
      status: 'active',
      subscription_code: 'SUB_vsyqdmlzble3uii',
      amount: 50000,
      currency: 'NGN',
    },
    transaction: {
      id: 12345,
      reference: 'ref_123456789',
      amount: 50000,
      currency: 'NGN',
      status: 'pending',
    },
    invoice_code: 'INV_123456789',
    paid: false,
    created_at: '2020-11-26T14:45:06.000Z',
  },
};

// Example webhook payload for invoice.update event
const invoiceUpdatePayload = {
  event: 'invoice.update',
  data: {
    id: 12345,
    domain: 'test',
    status: 'paid',
    amount: 50000,
    currency: 'NGN',
    customer: {
      id: 84312,
      first_name: 'BoJack',
      last_name: 'Horseman',
      email: 'onyenikechukwudi@gmail.com',
      customer_code: 'CUS_xnxdt6s1zg1f4nx',
      phone: '',
      metadata: {},
      risk_action: 'default',
    },
    subscription: {
      id: 1234,
      status: 'active',
      subscription_code: 'SUB_vsyqdmlzble3uii',
      amount: 50000,
      currency: 'NGN',
    },
    transaction: {
      id: 12345,
      reference: 'ref_123456789',
      amount: 50000,
      currency: 'NGN',
      status: 'success',
    },
    invoice_code: 'INV_123456789',
    paid: true,
    created_at: '2020-11-26T14:45:06.000Z',
  },
};

// Example webhook payload for invoice.payment_succeeded event
const invoicePaymentSucceededPayload = {
  event: 'invoice.payment_succeeded',
  data: {
    id: 12345,
    domain: 'test',
    status: 'paid',
    amount: 50000,
    currency: 'NGN',
    customer: {
      id: 84312,
      first_name: 'BoJack',
      last_name: 'Horseman',
      email: 'onyenikechukwudi@gmail.com',
      customer_code: 'CUS_xnxdt6s1zg1f4nx',
      phone: '',
      metadata: {},
      risk_action: 'default',
    },
    subscription: {
      id: 1234,
      status: 'active',
      subscription_code: 'SUB_vsyqdmlzble3uii',
      amount: 50000,
      currency: 'NGN',
    },
    transaction: {
      id: 12345,
      reference: 'ref_123456789',
      amount: 50000,
      currency: 'NGN',
      status: 'success',
    },
    invoice_code: 'INV_123456789',
    paid: true,
    created_at: '2020-11-26T14:45:06.000Z',
  },
};

// Example webhook payload for invoice.payment_failed event
const invoicePaymentFailedPayload = {
  event: 'invoice.payment_failed',
  data: {
    id: 12345,
    domain: 'test',
    status: 'failed',
    amount: 50000,
    currency: 'NGN',
    customer: {
      id: 84312,
      first_name: 'BoJack',
      last_name: 'Horseman',
      email: 'onyenikechukwudi@gmail.com',
      customer_code: 'CUS_xnxdt6s1zg1f4nx',
      phone: '',
      metadata: {},
      risk_action: 'default',
    },
    subscription: {
      id: 1234,
      status: 'active',
      subscription_code: 'SUB_vsyqdmlzble3uii',
      amount: 50000,
      currency: 'NGN',
    },
    transaction: {
      id: 12345,
      reference: 'ref_123456789',
      amount: 50000,
      currency: 'NGN',
      status: 'failed',
    },
    invoice_code: 'INV_123456789',
    paid: false,
    created_at: '2020-11-26T14:45:06.000Z',
  },
};

// Function to generate the Paystack signature
function generatePaystackSignature(payload) {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest('hex');
  console.log('hash', hash);

  return hash;
}

// Function to send the webhook request
async function sendWebhookRequest(payload) {
  const signature = generatePaystackSignature(payload);

  try {
    const response = await axios.post(WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-paystack-signature': signature,
      },
    });

    console.log(`Webhook sent successfully for event: ${payload.event}`);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error sending webhook:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Main function to run the test
async function runTest() {
  console.log('Starting webhook test...');

  // Test subscription.disable event
  console.log('\nTesting webhook url...');
  await sendWebhookRequest(invoicePaymentFailedPayload);

  console.log('\nTest completed!');
}

// Run the test
runTest();
