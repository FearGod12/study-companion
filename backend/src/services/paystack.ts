export class PayStackService {
  private readonly secretKey: string;
  private readonly baseUrl: string = 'https://api.paystack.co';

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async createPlan(data: { name: string; amount: number; interval: 'monthly' }) {
    const response = await fetch(`${this.baseUrl}/plan`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        amount: data.amount * 100, // Convert to kobo
        interval: data.interval,
      }),
    });

    return response.json();
  }

  async initializeSubscription(data: { email: string; planCode: string; callback_url?: string }) {
    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        plan: data.planCode,
        callback_url: data.callback_url,
      }),
    });

    return response.json();
  }

  async verifyTransaction(reference: string) {
    const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });

    return response.json();
  }

  async listSubscriptions(data?: {
    perPage?: number;
    page?: number;
    planCode?: string;
    customerEmail?: string;
  }) {
    const params = new URLSearchParams();
    if (data?.perPage) params.append('perPage', data.perPage.toString());
    if (data?.page) params.append('page', data.page.toString());
    if (data?.planCode) params.append('plan', data.planCode);
    if (data?.customerEmail) params.append('customer', data.customerEmail);

    const response = await fetch(`${this.baseUrl}/subscription?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });

    return response.json();
  }

  async cancelSubscription(subscriptionCode: string) {
    const response = await fetch(`${this.baseUrl}/subscription/disable`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: subscriptionCode,
        token: subscriptionCode,
      }),
    });

    return response.json();
  }
}
