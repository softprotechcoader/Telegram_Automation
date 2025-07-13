/**
 * API Gateway Main Module
 *
 * This module serves as the root module for the API Gateway microservice.
 * It configures all core modules, environment variables, and imports
 * the gateway functionality for routing requests to microservices.
 *
 * Architecture:
 * - ConfigModule: Global configuration management
 * - GatewayModule: Core routing and service communication
 * - AppController: Health check and monitoring endpoints
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { GatewayModule } from './gateway/gateway.module';

/**
 * Main application module for the API Gateway
 * Configures all core modules and provides the application structure
 */
@Module({
  imports: [
    // Global configuration module for environment variables
    // Makes config service available throughout the application
    ConfigModule.forRoot({
      isGlobal: true, // ensures it's accessible everywhere
    }),

    // Gateway module for routing requests to microservices
    // Handles all inter-service communication and request routing
    GatewayModule,
  ],

  // Root controller for health checks and monitoring
  // Provides basic application status and health endpoints
  controllers: [AppController],
})
export class AppModule {}
