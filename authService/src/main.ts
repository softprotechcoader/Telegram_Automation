import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Bootstrap function to initialize and start the NestJS application
 * This is the entry point of the application that sets up all middleware,
 * validation, documentation, and starts the HTTP server
 */
async function bootstrap() {
  // Create the NestJS application instance
  // This initializes the dependency injection container and loads all modules
  const app = await NestFactory.create(AppModule);
  
  // Enable Cross-Origin Resource Sharing (CORS)
  // This allows the API to be accessed from different domains and frontend applications
  // Essential for web applications that need to communicate with this API
  app.enableCors();
  
  // Enable global validation pipe for automatic request validation
  // This validates incoming requests based on DTO decorators and class-validator
  // Automatically transforms and validates all incoming requests
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
    transform: true, // Transform payloads to be objects typed according to their DTO classes
  }));

  // Configure Swagger/OpenAPI documentation
  // This creates interactive API documentation accessible at /api endpoint
  // Provides detailed schemas, request/response examples, and testing interface
  const config = new DocumentBuilder()
    .setTitle('Telegram Automation API')
    .setDescription('API documentation for Telegram Automation service with multi-role authentication and authorization')
    .setVersion('1.0')
    .addBearerAuth() // Add JWT Bearer token authentication support to Swagger UI
    .build();
  
  // Generate the Swagger document and set up the documentation endpoint
  // This creates a comprehensive API documentation with all endpoints, schemas, and examples
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server on the specified port
  // Uses environment variable PORT or defaults to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  // Log the application URLs for easy access
  // Provides clear information about where to access the application and documentation
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/api`);
  console.log(`🔍 Health check available at: http://localhost:${port}/`);
  console.log(`⚙️ Environment: ${process.env.NODE_ENV || 'development'}`);
}

// Start the application
// This calls the bootstrap function and handles any startup errors
bootstrap().catch(error => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
}); 