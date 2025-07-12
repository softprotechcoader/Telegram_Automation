import { Controller, Get } from '@nestjs/common';

/**
 * Root controller for the application
 * Provides basic health check and welcome endpoints
 * This controller handles the root-level routes and serves as the entry point
 * for basic application status and monitoring
 */
@Controller()
export class AppController {
  
  /**
   * Root endpoint - Health check and welcome message
   * This endpoint provides a simple health check for the application
   * Useful for monitoring systems, load balancers, and basic connectivity tests
   * 
   * @returns Object containing a welcome message and application status
   * 
   * @example
   * GET /
   * Response: { "message": "API is running" }
   */
  @Get()
  getRoot() {
    // Return a simple welcome message indicating the API is operational
    // This helps with monitoring and basic connectivity verification
    return { 
      message: 'API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      status: 'healthy'
    };
  }
} 