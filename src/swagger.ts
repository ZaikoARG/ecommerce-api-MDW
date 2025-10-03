import { Options } from 'swagger-jsdoc';
import path from 'path';

const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce Backend API',
            version: '1.0.0',
            description: 'API para e-commerce con auth JWT y MongoDB',
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'produccion' ? 'https://ecommerce-api-mdw.onrender.com/api' : 'http://localhost:3000/api',
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'accessToken',
                    description: 'JWT Access Token en cookie',
                },
            },
        },
    },
    apis: [`${__dirname}/routes/*.ts`],  // Escanea tus rutas para JSDoc comments
};

export default swaggerOptions;