/**
 * API Gateway Controller
 *
 * This controller handles all incoming requests and routes them to appropriate
 * microservices based on the URL path. It acts as the central routing hub
 * for the entire microservices architecture.
 *
 * Routing Strategy:
 * - /gateway/auth/* -> Authentication Service (port 3000)
 * - /gateway/users/* -> User Management Service (port 3002)
 * - /gateway/telegram/* -> Telegram Bot Service (port 3003)
 *
 * Security:
 * - Auth routes are public (no authentication required)
 * - User and Telegram routes require JWT authentication
 * - All requests are logged for monitoring and debugging
 */

import {
  Controller,
  All,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { GatewayService } from './gateway.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';

/**
 * Gateway controller for routing requests to microservices
 * Handles all /gateway/* routes and forwards them to appropriate services
 */
@ApiTags('API Gateway')
@Controller('gateway')
@UseInterceptors(LoggingInterceptor) // Log all gateway requests for monitoring
export class GatewayController {
  constructor(private gatewayService: GatewayService) {}

  /**
   * Route all authentication-related requests to the Auth Service
   *
   * This endpoint handles all /gateway/auth/* requests and forwards them
   * to the authentication service running on port 3000.
   *
   * Public endpoint - no authentication required
   *
   * @param req - Express request object
   * @param res - Express response object
   * @returns Response from the authentication service
   *
   * @example
   * POST /gateway/auth/login -> forwarded to http://localhost:3000/login
   * POST /gateway/auth/register -> forwarded to http://localhost:3000/register
   */
  @All('auth/*')
  @ApiOperation({ summary: 'Route to Authentication Service' })
  async routeToAuth(@Req() req: Request, @Res() res: Response) {
    try {
      // Extract the path after /gateway/auth for forwarding to auth service
      const path = req.url.replace('/gateway/auth', '');

      // Route the request to the authentication service
      const result = await this.gatewayService.routeRequest(
        'auth', // Target service
        req.method, // HTTP method (GET, POST, etc.)
        path, // Path relative to auth service
        req.body, // Request body data
        req.headers, // Request headers (including Authorization)
      );

      // Return successful response from auth service
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      // Handle errors from auth service
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Route all user management requests to the User Service
   *
   * This endpoint handles all /gateway/users/* requests and forwards them
   * to the user management service running on port 3002.
   *
   * Protected endpoint - requires JWT authentication
   *
   * @param req - Express request object
   * @param res - Express response object
   * @returns Response from the user management service
   *
   * @example
   * GET /gateway/users/profile -> forwarded to http://localhost:3002/profile
   * PUT /gateway/users/123 -> forwarded to http://localhost:3002/123
   */
  @All('users/*')
  @UseGuards(JwtAuthGuard) // Require JWT authentication
  @ApiBearerAuth() // Document Bearer token requirement in Swagger
  @ApiOperation({ summary: 'Route to User Management Service' })
  async routeToUser(@Req() req: Request, @Res() res: Response) {
    try {
      // Extract the path after /gateway/users for forwarding to user service
      const path = req.url.replace('/gateway/users', '');

      // Route the request to the user management service
      const result = await this.gatewayService.routeRequest(
        'user', // Target service
        req.method, // HTTP method
        path, // Path relative to user service
        req.body, // Request body data
        req.headers, // Request headers (including Authorization)
      );

      // Return successful response from user service
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      // Handle errors from user service
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Route all Telegram bot requests to the Telegram Service
   *
   * This endpoint handles all /gateway/telegram/* requests and forwards them
   * to the Telegram bot service running on port 3003.
   *
   * Protected endpoint - requires JWT authentication
   *
   * @param req - Express request object
   * @param res - Express response object
   * @returns Response from the Telegram bot service
   *
   * @example
   * POST /gateway/telegram/send-message -> forwarded to http://localhost:3003/send-message
   * GET /gateway/telegram/webhook -> forwarded to http://localhost:3003/webhook
   */
  @All('telegram/*')
  @UseGuards(JwtAuthGuard) // Require JWT authentication
  @ApiBearerAuth() // Document Bearer token requirement in Swagger
  @ApiOperation({ summary: 'Route to Telegram Bot Service' })
  async routeToTelegram(@Req() req: Request, @Res() res: Response) {
    try {
      // Extract the path after /gateway/telegram for forwarding to telegram service
      const path = req.url.replace('/gateway/telegram', '');

      // Route the request to the Telegram bot service
      const result = await this.gatewayService.routeRequest(
        'telegram', // Target service
        req.method, // HTTP method
        path, // Path relative to telegram service
        req.body, // Request body data
        req.headers, // Request headers (including Authorization)
      );

      // Return successful response from telegram service
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      // Handle errors from telegram service
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
