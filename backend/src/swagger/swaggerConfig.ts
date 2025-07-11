import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'STUDY COMPANION API',
      version: '1.0.0',
      description: 'Documentation of API endpoints for Study Companion application.',
    },
    tags: [
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Schedules',
        description: 'Schedule management operations',
      },
      {
        name: 'Study Sessions',
        description: 'Study session management operations',
      },
      {
        name: 'Premium',
        description: 'Premium subscription operations',
      },
      {
        name: 'Webhooks',
        description: 'Webhook endpoints for third-party services',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        PaystackSignature: {
          type: 'apiKey',
          in: 'header',
          name: 'x-paystack-signature',
          description:
            'Paystack webhook signature for verifying the authenticity of webhook requests',
        },
      },
    },
  },
  apis: ['./dist/routes/*.js'], // Updated path to point to the compiled JavaScript files
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
