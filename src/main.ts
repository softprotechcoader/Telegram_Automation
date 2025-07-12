import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Bootstrap function to initialize and start the NestJS application
 * This is the entry point of the application
 */
async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);
  
  // Enable Cross-Origin Resource Sharing (CORS)
  // This allows the API to be accessed from different domains
  app.enableCors();
  
  // Enable global validation pipe for automatic request validation
  // This validates incoming requests based on DTO decorators
  app.useGlobalPipes(new ValidationPipe());

  // Configure Swagger/OpenAPI documentation
  // This creates interactive API documentation
  const config = new DocumentBuilder()
    .setTitle('Telegram Automation API')
    .setDescription('API documentation for Telegram Automation service')
    .setVersion('1.0')
    .addBearerAuth() // Add JWT Bearer token authentication support
    .build();
  
  // Generate the Swagger document and set up the documentation endpoint
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server on the specified port
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  // Log the application URLs for easy access
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API Documentation available at: http://localhost:${port}/api`);
}

// Start the application
bootstrap(); 