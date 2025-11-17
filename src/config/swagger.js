import  swaggerJsdoc  from "swagger-jsdoc";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Burguer Robles Api',
      version: '1.0.0',
      description: 'Documentación de API con Express y Swagger',
      contact: {
        name: 'Soporte API',
        email: 'soporte@api.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  // Rutas donde buscar comentarios de documentación
  apis: [
    './src/routes/*.js',
    // './src/models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

export default specs