import swaggerJSDoc from 'swagger-jsdoc';
const options = {
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
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
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
