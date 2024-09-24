import swaggerJSDoc from 'swagger-jsdoc';
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'STUDY COMPANION API',
            version: '1.0.0',
            description: 'Documentation of API endpoints for Study Companion application.',
            contact: {
                name: 'API Support',
                url: 'https://www.studycompanion.com/support',
                email: 'support@studycompanion.com',
            },
            license: {
                name: 'Apache 2.0',
                url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
            },
        },
        // servers: [
        //   {
        //     url: 'https://api.studycompanion.com/v1',
        //     description: 'Production server',
        //   },
        //   {
        //     url: 'https://staging-api.studycompanion.com/v1',
        //     description: 'Staging server',
        //   },
        //   {
        //     url: 'http://localhost:3000/v1',
        //     description: 'Local development server',
        //   },
        // ],
        tags: [
            {
                name: 'Users',
                description: 'User management operations',
            },
            // Add more tags as needed for other API categories
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts'], // Update this path to match your project structure
};
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
