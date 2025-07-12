# API Gateway Implementation Guide

This guide provides step-by-step instructions for implementing the API Gateway with Swagger integration and microservices communication.

## 🚀 Quick Start

### **Step 1: Create API Gateway Project**
```bash
# Create new NestJS project for API Gateway
nest new api-gateway
cd api-gateway

# Install required dependencies
npm install @nestjs/microservices @nestjs/websockets
npm install @nestjs/swagger class-validator class-transformer
npm install @nestjs/throttler @nestjs/config
npm install axios http-proxy-middleware
```

### **Step 2: Configure Environment**
```env
# .env file for API Gateway
PORT=3000
NODE_ENV=development

# Service URLs
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
TELEGRAM_SERVICE_URL=http://localhost:3003

# JWT Configuration
JWT_SECRET=your-secret-key-here

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

## 🏗️ API Gateway Structure

### **Project Structure**
```
api-gateway/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Main module configuration
│   ├── app.controller.ts       # Health check controller
│   ├── gateway/
│   │   ├── gateway.module.ts   # Gateway module
│   │   ├── gateway.service.ts  # Service communication logic
│   │   └── gateway.controller.ts # Route handling
│   ├── auth/
│   │   ├── auth.module.ts      # Authentication module
│   │   ├── auth.guard.ts       # JWT authentication guard
│   │   └── auth.middleware.ts  # Authentication middleware
│   ├── swagger/
│   │   └── swagger.config.ts   # Swagger configuration
│   └── common/
│       ├── interceptors/
│       │   └── logging.interceptor.ts
│       └── filters/
│           └── http-exception.filter.ts
├── docker-compose.yml          # Local development setup
└── Dockerfile                  # Container configuration
```

## 🔧 Implementation Details

### **1. Main Application Setup**

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Telegram Automation API Gateway')
    .setDescription('API Gateway for Telegram Automation microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3000', 'Development server')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 API Gateway running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api`);
}

bootstrap();
```

### **2. Gateway Module Configuration**

```typescript
// src/gateway/gateway.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: parseInt(process.env.THROTTLE_TTL || '60'),
      limit: parseInt(process.env.THROTTLE_LIMIT || '100'),
    }),
    AuthModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
```

### **3. Gateway Service Implementation**

```typescript
// src/gateway/gateway.service.ts
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
      baseURL: this.configService.get('AUTH_SERVICE_URL'),
      timeout: 10000,
    });

    this.userService = axios.create({
      baseURL: this.configService.get('USER_SERVICE_URL'),
      timeout: 10000,
    });

    this.telegramService = axios.create({
      baseURL: this.configService.get('TELEGRAM_SERVICE_URL'),
      timeout: 10000,
    });

    // Add request interceptors for logging
    this.setupInterceptors();
  }

  private setupInterceptors() {
    const services = [this.authService, this.userService, this.telegramService];
    
    services.forEach(service => {
      service.interceptors.request.use(
        (config) => {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
          return config;
        },
        (error) => {
          console.error('❌ Request error:', error);
          return Promise.reject(error);
        }
      );

      service.interceptors.response.use(
        (response) => {
          console.log(`✅ ${response.status} ${response.config.url}`);
          return response;
        },
        (error) => {
          console.error('❌ Response error:', error.response?.status, error.config?.url);
          return Promise.reject(error);
        }
      );
    });
  }

  // Route requests to appropriate services
  async routeRequest(service: string, method: string, path: string, data?: any, headers?: any) {
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
        throw new HttpException(
          error.response.data,
          error.response.status
        );
      }
      throw new HttpException('Service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
```

### **4. Gateway Controller**

```typescript
// src/gateway/gateway.controller.ts
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

@ApiTags('API Gateway')
@Controller('gateway')
@UseInterceptors(LoggingInterceptor)
export class GatewayController {
  constructor(private gatewayService: GatewayService) {}

  @All('auth/*')
  @ApiOperation({ summary: 'Route to Authentication Service' })
  async routeToAuth(@Req() req: Request, @Res() res: Response) {
    try {
      const path = req.url.replace('/gateway/auth', '');
      const result = await this.gatewayService.routeRequest(
        'auth',
        req.method,
        path,
        req.body,
        req.headers
      );
      
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  @All('users/*')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Route to User Management Service' })
  async routeToUser(@Req() req: Request, @Res() res: Response) {
    try {
      const path = req.url.replace('/gateway/users', '');
      const result = await this.gatewayService.routeRequest(
        'user',
        req.method,
        path,
        req.body,
        req.headers
      );
      
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  @All('telegram/*')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Route to Telegram Bot Service' })
  async routeToTelegram(@Req() req: Request, @Res() res: Response) {
    try {
      const path = req.url.replace('/gateway/telegram', '');
      const result = await this.gatewayService.routeRequest(
        'telegram',
        req.method,
        path,
        req.body,
        req.headers
      );
      
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
```

### **5. Authentication Guard**

```typescript
// src/auth/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      
      // Attach user to request
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

## 🐳 Docker Configuration

### **Dockerfile**
```dockerfile
# Dockerfile for API Gateway
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
```

### **Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  api-gateway:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - AUTH_SERVICE_URL=http://auth-service:3001
      - USER_SERVICE_URL=http://user-service:3002
      - TELEGRAM_SERVICE_URL=http://telegram-service:3003
      - JWT_SECRET=your-secret-key-here
    depends_on:
      - auth-service
      - user-service
      - telegram-service
    networks:
      - microservices-network

  auth-service:
    build: ../auth-service
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - PORT=3001
      - DB_TYPE=mssql
      - DB_HOST=db
      - DB_PORT=1433
      - DB_NAME=telegram_automation
      - JWT_SECRET=your-secret-key-here
    depends_on:
      - db
    networks:
      - microservices-network

  user-service:
    build: ../user-service
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=development
      - PORT=3002
      - DB_TYPE=mssql
      - DB_HOST=db
      - DB_PORT=1433
      - DB_NAME=telegram_automation
    depends_on:
      - db
    networks:
      - microservices-network

  telegram-service:
    build: ../telegram-service
    ports:
      - "3003:3003"
    environment:
      - NODE_ENV=development
      - PORT=3003
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    networks:
      - microservices-network

  db:
    image: mcr.microsoft.com/mssql/server:2019-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong@Passw0rd
    ports:
      - "1433:1433"
    volumes:
      - mssql_data:/var/opt/mssql
    networks:
      - microservices-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - microservices-network

volumes:
  mssql_data:

networks:
  microservices-network:
    driver: bridge
```

## 📊 Monitoring & Logging

### **Logging Interceptor**
```typescript
// src/common/interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        
        console.log(`${method} ${url} ${response.statusCode} ${delay}ms`);
      }),
    );
  }
}
```

## 🧪 Testing

### **Unit Tests**
```typescript
// src/gateway/gateway.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GatewayService } from './gateway.service';

describe('GatewayService', () => {
  let service: GatewayService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GatewayService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                'AUTH_SERVICE_URL': 'http://localhost:3001',
                'USER_SERVICE_URL': 'http://localhost:3002',
                'TELEGRAM_SERVICE_URL': 'http://localhost:3003',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<GatewayService>(GatewayService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should route auth requests correctly', async () => {
    // Mock axios response
    jest.spyOn(service['authService'], 'request').mockResolvedValue({
      data: { message: 'Auth service response' },
    });

    const result = await service.routeRequest('auth', 'GET', '/login');
    expect(result).toEqual({ message: 'Auth service response' });
  });
});
```

## 🚀 Deployment

### **Production Deployment**
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Check service health
curl http://localhost:3000/health

# Access Swagger documentation
open http://localhost:3000/api
```

### **Health Check Endpoint**
```typescript
// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
      version: '1.0.0',
    };
  }
}
```

## 📋 Next Steps

1. **Create the API Gateway project** using the provided structure
2. **Extract your current auth service** into a separate microservice
3. **Create user management service** with CRUD operations
4. **Implement Telegram bot service** in Python or Go
5. **Set up inter-service communication** with message queues
6. **Add comprehensive monitoring** and logging
7. **Deploy to production** with Kubernetes

This API Gateway implementation provides a solid foundation for your microservices architecture with unified API documentation, authentication, and service routing. 