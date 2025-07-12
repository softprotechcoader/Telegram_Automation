import { Controller, Get } from '@nestjs/common';

/**
 * Root controller for the application
 * Provides basic health check and welcome endpoints
 */
@Controller()
export class AppController {
  
  /**
   * Root endpoint - Health check and welcome message
   * @returns Object containing a welcome message
   */
  @Get()
  getRoot() {
    return { message: 'API is running' };
  }
} 