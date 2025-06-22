const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'API documentation for Task Manager backend',
    },
    servers: [
      { url: 'http://localhost:4000' },
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
    security: [{ bearerAuth: [] }],
  },
  apis: [], // You can add JSDoc comments in your route files for more details
};

const openapiSpec = swaggerJsdoc(options);

router.use('/', swaggerUi.serve, swaggerUi.setup(openapiSpec));

module.exports = router; 