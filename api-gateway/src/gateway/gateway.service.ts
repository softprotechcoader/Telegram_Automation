/**
 * API Gateway Service
 *
 * This service handles all inter-service communication for the API Gateway.
 * It manages HTTP clients for different microservices and routes requests
 * to the appropriate services based on the request path.
 *
 * Key Responsibilities:
 * - Initialize HTTP clients for each microservice
 * - Route requests to appropriate services
 * - Handle service communication errors
 * - Provide logging and monitoring for all requests
 * - Manage timeouts and retry logic
 *
 * Supported Services:
 * - Auth Service: Authentication and authorization
 * - User Service: User management and profiles
 * - Telegram Service: Telegram bot functionality
 */

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

/**
 * Gateway service for routing requests to microservices
 * Manages HTTP clients and inter-service communication
 */
@Injectable()
export class GatewayService {
  // HTTP clients for each microservice
  private authService: AxiosInstance; // Authentication service client
  private userService: AxiosInstance; // User management service client
  private telegramService: AxiosInstance; // Telegram bot service client

  constructor(private configService: ConfigService) {
    // Initialize HTTP clients for each microservice
    // Each client is configured with base URL and timeout settings
    this.authService = axios.create({
      baseURL:
        this.configService.get('AUTH_SERVICE_URL') || 'http://localhost:3000',
      timeout: 10000, // 10 second timeout for all requests
    });

    this.userService = axios.create({
      baseURL:
        this.configService.get('USER_SERVICE_URL') || 'http://localhost:3002',
      timeout: 10000, // 10 second timeout for all requests
    });

    this.telegramService = axios.create({
      baseURL:
        this.configService.get('TELEGRAM_SERVICE_URL') ||
        'http://localhost:3003',
      timeout: 10000, // 10 second timeout for all requests
    });

    // Set up request/response interceptors for logging and monitoring
    this.setupInterceptors();
  }

  /**
   * Set up axios interceptors for logging and monitoring
   * Provides visibility into all inter-service communication
   */
  private setupInterceptors() {
    const services = [this.authService, this.userService, this.telegramService];

    services.forEach((service) => {
      // Request interceptor - logs outgoing requests
      service.interceptors.request.use(
        (config) => {
          console.log(
            `🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
          );
          return config;
        },
        (error) => {
          console.error('❌ Request error:', error);
          return Promise.reject(error);
        },
      );

      // Response interceptor - logs incoming responses
      service.interceptors.response.use(
        (response) => {
          console.log(`✅ ${response.status} ${response.config.url}`);
          return response;
        },
        (error) => {
          console.error(
            '❌ Response error:',
            error.response?.status,
            error.config?.url,
          );
          return Promise.reject(error);
        },
      );
    });
  }

  /**
   * Route requests to appropriate microservices
   *
   * @param service - Target service name (auth, user, telegram)
   * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param path - Request path relative to service base URL
   * @param data - Request body data (for POST, PUT requests)
   * @param headers - Request headers (including Authorization)
   * @returns Response data from the target service
   * @throws HttpException if service not found or communication fails
   */
  async routeRequest(
    service: string,
    method: string,
    path: string,
    data?: any,
    headers?: any,
  ) {
    let serviceClient: AxiosInstance;

    // Determine which service client to use based on service name
    switch (service) {
      case 'auth':
        serviceClient = this.authService;
        break;
      case 'user':
        serviceClient = this.userService;
        break;
      case 'telegram':
        serviceClient = this.telegramService;
        break;
      default:
        // Return 404 if service is not recognized
        throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }

    try {
      // Make the request to the target service
      const response: AxiosResponse = await serviceClient.request({
        method: method.toLowerCase(),
        url: path,
        data,
        headers,
      });

      // Return the response data from the target service
      return response.data;
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // Service responded with an error status
        throw new HttpException(error.response.data, error.response.status);
      }
      // Service is unavailable or network error
      throw new HttpException(
        'Service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
