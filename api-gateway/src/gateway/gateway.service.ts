import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

@Injectable()
export class GatewayService {
  private authService: AxiosInstance;
  private userService: AxiosInstance;
  private telegramService: AxiosInstance;

  constructor(private configService: ConfigService) {
    // Initialize service clients
    this.authService = axios.create({
      baseURL:
        this.configService.get('AUTH_SERVICE_URL') || 'http://localhost:3001',
      timeout: 10000,
    });

    this.userService = axios.create({
      baseURL:
        this.configService.get('USER_SERVICE_URL') || 'http://localhost:3002',
      timeout: 10000,
    });

    this.telegramService = axios.create({
      baseURL:
        this.configService.get('TELEGRAM_SERVICE_URL') ||
        'http://localhost:3003',
      timeout: 10000,
    });

    // Add request interceptors for logging
    this.setupInterceptors();
  }

  private setupInterceptors() {
    const services = [this.authService, this.userService, this.telegramService];

    services.forEach((service) => {
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

  // Route requests to appropriate services
  async routeRequest(
    service: string,
    method: string,
    path: string,
    data?: any,
    headers?: any,
  ) {
    let serviceClient: AxiosInstance;

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
        throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }

    try {
      const response: AxiosResponse = await serviceClient.request({
        method: method.toLowerCase(),
        url: path,
        data,
        headers,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException(
        'Service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
