/**
 * Gateway Module
 *
 * This module configures the core gateway functionality for the API Gateway.
 * It sets up all necessary services, controllers, and middleware for routing
 * requests to microservices and handling authentication.
 *
 * Key Components:
 * - ConfigModule: Environment variable management
 * - ThrottlerModule: Rate limiting for API protection
 * - JwtModule: JWT token validation and generation
 * - GatewayController: Request routing logic
 * - GatewayService: Inter-service communication
 * - JwtAuthGuard: Authentication protection
 *
 * Features:
 * - Rate limiting to prevent abuse
 * - JWT authentication for protected routes
 * - Environment-based configuration
 * - Comprehensive request routing
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { JwtAuthGuard } from '../auth/auth.guard';

/**
 * Gateway module for configuring API Gateway functionality
 * Sets up all necessary services and middleware for microservices routing
 */
@Module({
  imports: [
    // Configuration module for environment variables
    // Provides access to environment variables throughout the application
    ConfigModule.forRoot(),

    // Rate limiting module for API protection
    // Prevents abuse by limiting requests per time window
    ThrottlerModule.forRoot({
      ttl: parseInt(process.env.THROTTLE_TTL || '60'), // Time window in seconds
      limit: parseInt(process.env.THROTTLE_LIMIT || '100'), // Max requests per window
    }),

    // JWT module for token validation and generation
    // Handles JWT operations for authentication
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // JWT signing secret
      signOptions: { expiresIn: '1d' }, // Token expiration time
    }),
  ],

  // Gateway controller for handling all routing requests
  // Routes requests to appropriate microservices
  controllers: [GatewayController],

  // Service providers for gateway functionality
  // Includes service for communication and auth guard for protection
  providers: [GatewayService, JwtAuthGuard],
})
export class GatewayModule {}
