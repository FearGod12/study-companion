# Testing Paystack Webhooks Locally

This guide will help you test the Paystack webhooks locally using the test script provided.

## Prerequisites

1. Make sure your backend server is running locally
2. Install the required dependencies:
   ```bash
   npm install axios
   ```

## Configuration

1. Open the `test-webhook.js` file and update the following variables:
   - `PAYSTACK_SECRET_KEY`: Replace with your Paystack test secret key
   - `WEBHOOK_URL`: Update if your local server is running on a different port or path

## Running the Test

1. Start your backend server:

   ```bash
   npm run dev
   ```

2. In a separate terminal, run the test script:

   ```bash
   node test-webhook.js
   ```

3. The script will send a test webhook request for the `subscription.disable` event.

4. Check your server logs to see the webhook processing results.

## Testing with Postman or cURL

You can also test the webhooks manually using Postman or cURL:

### Using cURL

```bash
# Generate the signature (replace with your actual payload)
PAYLOAD='{"event":"subscription.disable","data":{"domain":"test","status":"complete","subscription_code":"SUB_vsyqdmlzble3uii","email_token":"ctt824k16n34u69","amount":300000,"cron_expression":"0 * * * *","next_payment_date":"2020-11-26T15:00:00.000Z","open_invoice":null,"plan":{"id":67572,"name":"Monthly retainer","plan_code":"PLN_gx2wn530m0i3w3m","description":null,"amount":50000,"interval":"monthly","send_invoices":true,"send_sms":true,"currency":"NGN"},"authorization":{"authorization_code":"AUTH_96xphygz","bin":"539983","last4":"7357","exp_month":"10","exp_year":"2017","card_type":"MASTERCARD DEBIT","bank":"GTBANK","country_code":"NG","brand":"MASTERCARD","account_name":"BoJack Horseman"},"customer":{"first_name":"BoJack","last_name":"Horseman","email":"bojack@horsinaround.com","customer_code":"CUS_xnxdt6s1zg1f4nx","phone":"","metadata":{},"risk_action":"default"},"created_at":"2020-11-26T14:45:06.000Z"}}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha512 -hmac "YOUR_PAYSTACK_SECRET_KEY" | cut -d' ' -f2)

# Send the webhook request
curl -X POST http://localhost:3000/api/webhook/paystack \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

### Using Postman

1. Create a new POST request to `http://localhost:3000/api/webhook/paystack`
2. Add the following headers:
   - `Content-Type: application/json`
   - `x-paystack-signature: [generated signature]`
3. In the request body, select "raw" and "JSON", then paste the webhook payload
4. Send the request

## Troubleshooting

- If you get a "Invalid Paystack signature" error, make sure you're using the correct secret key and that the signature is being generated correctly.
- If you get a "User not found" error, make sure the email in the webhook payload matches a user in your database.
- Check your server logs for more detailed error messages.

## Paystack Test Keys

- Test Secret Key: `sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Test Public Key: `pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

Replace `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual test keys from the Paystack dashboard.
