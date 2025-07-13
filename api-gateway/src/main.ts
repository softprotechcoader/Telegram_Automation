/**
 * API Gateway Main Entry Point
 *
 * This file bootstraps the API Gateway microservice which acts as the central
 * entry point for all client requests. It routes requests to appropriate
 * microservices and provides unified API documentation.
 *
 * Key Features:
 * - CORS configuration for cross-origin requests
 * - Global validation pipe for request validation
 * - Swagger/OpenAPI documentation setup
 * - Environment-based port configuration
 * - Comprehensive logging for monitoring
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Bootstrap function to initialize and start the API Gateway
 * This is the entry point that sets up all middleware, validation,
 * documentation, and starts the HTTP server
 */
async function bootstrap() {
  // Create the NestJS application instance
  // This initializes the dependency injection container and loads all modules
  const app = await NestFactory.create(AppModule);

  // Enable Cross-Origin Resource Sharing (CORS)
  // This allows the API Gateway to be accessed from different domains
  // Essential for frontend applications that need to communicate with microservices
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true, // Allow credentials (cookies, authorization headers)
  });

  // Enable global validation pipe for automatic request validation
  // This validates incoming requests based on DTO decorators and class-validator
  // Automatically transforms and validates all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
      transform: true, // Transform payloads to be objects typed according to their DTO classes
    }),
  );

  // Configure Swagger/OpenAPI documentation
  // This creates interactive API documentation accessible at /api endpoint
  // Provides detailed schemas, request/response examples, and testing interface
  const config = new DocumentBuilder()
    .setTitle('Telegram Automation API Gateway')
    .setDescription('API Gateway for Telegram Automation microservices')
    .setVersion('1.0')
    .addBearerAuth() // Add JWT Bearer token authentication support to Swagger UI
    .addServer('http://localhost:3000', 'Development server') // Server URL for Swagger
    .build();

  // Generate the Swagger document and set up the documentation endpoint
  // This creates a comprehensive API documentation with all endpoints, schemas, and examples
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server on the specified port
  // Uses environment variable PORT or defaults to 3001 to avoid conflict with auth service
  const port = process.env.PORT || 3001;
  await app.listen(port);

  // Log the application URLs for easy access
  // Provides clear information about where to access the application and documentation
  console.log(`🚀 API Gateway running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api`);
}

// Start the application
// This calls the bootstrap function and handles any startup errors
bootstrap();
