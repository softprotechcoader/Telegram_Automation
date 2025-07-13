/**
 * JWT Authentication Guard
 *
 * This guard validates JWT tokens for protected routes in the API Gateway.
 * It extracts the Bearer token from the Authorization header, verifies it,
 * and attaches the decoded user information to the request object.
 *
 * Key Features:
 * - Extracts JWT tokens from Authorization header
 * - Validates token signature and expiration
 * - Attaches user payload to request for downstream services
 * - Provides clear error messages for authentication failures
 *
 * Usage:
 * - Applied to protected routes using @UseGuards(JwtAuthGuard)
 * - Automatically validates all requests to protected endpoints
 * - Works with Swagger documentation for Bearer token authentication
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * JWT Authentication Guard for protecting API Gateway routes
 * Validates JWT tokens and ensures authenticated access to protected endpoints
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Validates JWT token and determines if request should be allowed
   *
   * This method is called for every request to protected routes.
   * It extracts the JWT token, validates it, and attaches user information
   * to the request object for use by downstream services.
   *
   * @param context - Execution context containing request information
   * @returns true if authentication is successful, false otherwise
   * @throws UnauthorizedException if token is missing or invalid
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the HTTP request from the execution context
    const request = context.switchToHttp().getRequest<Request>();

    // Extract JWT token from Authorization header
    const token = this.extractTokenFromHeader(request);

    // Check if token is present
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify the JWT token using the secret key
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });

      // Attach the decoded user information to the request object
      // This makes user data available to downstream services
      request['user'] = payload;
      return true;
    } catch {
      // Token is invalid (expired, malformed, or wrong signature)
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Extracts JWT token from Authorization header
   *
   * Parses the Authorization header to extract the Bearer token.
   * Expected format: "Bearer <token>"
   *
   * @param request - Express request object
   * @returns JWT token string or undefined if not found
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    // Split Authorization header by space to separate "Bearer" from token
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    // Return token only if type is "Bearer"
    return type === 'Bearer' ? token : undefined;
  }
}
