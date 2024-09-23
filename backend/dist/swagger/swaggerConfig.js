import swaggerJSDoc from 'swagger-jsdoc';
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'STUDY COMPANION API',
            version: '1.0.0',
            description: 'Documentation of API endpoints for http request.'
        },
    },
    apis: ['./dist/routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
