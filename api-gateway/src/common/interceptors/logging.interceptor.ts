/**
 * Logging Interceptor
 *
 * This interceptor logs all HTTP requests and responses for monitoring
 * and debugging purposes. It captures request method, URL, response status,
 * and response time for every request that passes through the API Gateway.
 *
 * Key Features:
 * - Logs request method and URL
 * - Captures response status code
 * - Measures and logs response time
 * - Non-intrusive logging (doesn't modify request/response)
 * - Provides visibility into API Gateway performance
 *
 * Usage:
 * - Applied globally to all routes using @UseInterceptors(LoggingInterceptor)
 * - Automatically logs all requests without manual intervention
 * - Essential for monitoring and debugging in production
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logging interceptor for monitoring API Gateway requests
 * Captures request details and performance metrics for all HTTP requests
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /**
   * Intercepts HTTP requests and logs their details
   *
   * This method is called for every request that passes through the API Gateway.
   * It captures request information, measures response time, and logs the results
   * for monitoring and debugging purposes.
   *
   * @param context - Execution context containing request and response objects
   * @param next - Call handler for continuing the request pipeline
   * @returns Observable that logs request details after completion
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Extract request information for logging
    const request = context.switchToHttp().getRequest();
    const method = request.method; // HTTP method (GET, POST, etc.)
    const url = request.url; // Request URL path
    const now = Date.now(); // Start time for performance measurement

    // Continue with the request pipeline and log results after completion
    return next.handle().pipe(
      tap(() => {
        // Extract response information after request is completed
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now; // Calculate response time in milliseconds

        // Log request details in a consistent format
        // Format: METHOD URL STATUS_CODE RESPONSE_TIME
        // Example: "GET /gateway/auth/login 200 45ms"
        console.log(`${method} ${url} ${response.statusCode} ${delay}ms`);
      }),
    );
  }
}
