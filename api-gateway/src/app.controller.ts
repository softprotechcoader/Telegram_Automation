/**
 * API Gateway Root Controller
 *
 * This controller provides health check and monitoring endpoints for the API Gateway.
 * These endpoints are essential for monitoring systems, load balancers, and
 * basic connectivity verification.
 *
 * Endpoints:
 * - GET /: Root health check with service information
 * - GET /health: Dedicated health check endpoint
 *
 * Both endpoints return the same information for consistency and monitoring.
 */

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

/**
 * Root controller for API Gateway health checks and monitoring
 * Provides endpoints for load balancers and monitoring systems
 */
@ApiTags('Health Check')
@Controller()
export class AppController {
  /**
   * Root endpoint - Health check and service information
   * This endpoint provides a simple health check for the API Gateway
   * Useful for monitoring systems, load balancers, and basic connectivity tests
   *
   * @returns Object containing service status, timestamp, and version information
   *
   * @example
   * GET /
   * Response: { "status": "healthy", "timestamp": "...", "service": "api-gateway", "version": "1.0.0" }
   */
  @Get()
  @ApiOperation({ summary: 'Root health check' })
  getRoot() {
    // Return comprehensive health information for monitoring
    // Includes service identification and version for proper monitoring
    return {
      status: 'healthy', // Service health status
      timestamp: new Date().toISOString(), // Current timestamp for monitoring
      service: 'api-gateway', // Service name for identification
      version: '1.0.0', // Service version for tracking
    };
  }

  /**
   * Health check endpoint - Dedicated health monitoring
   * This endpoint provides a dedicated health check for monitoring systems
   * Returns the same information as root for consistency
   *
   * @returns Object containing service status, timestamp, and version information
   *
   * @example
   * GET /health
   * Response: { "status": "healthy", "timestamp": "...", "service": "api-gateway", "version": "1.0.0" }
   */
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth() {
    // Return the same health information as root endpoint
    // This ensures consistency across different health check URLs
    return {
      status: 'healthy', // Service health status
      timestamp: new Date().toISOString(), // Current timestamp for monitoring
      service: 'api-gateway', // Service name for identification
      version: '1.0.0', // Service version for tracking
    };
  }
}
