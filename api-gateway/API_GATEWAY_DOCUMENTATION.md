# API Gateway Documentation

## Overview

The API Gateway serves as the entry point for all client requests in the Telegram Automation microservices architecture. It provides routing, authentication, rate limiting, and request forwarding to appropriate microservices.

## Architecture

### Key Components

1. **Gateway Controller** (`gateway.controller.ts`)
   - Handles all incoming HTTP requests
   - Routes requests to appropriate microservices
   - Provides health check and root endpoints

2. **Gateway Service** (`gateway.service.ts`)
   - Manages inter-service communication
   - Handles request forwarding to microservices
   - Implements error handling and retry logic

3. **JWT Auth Guard** (`auth/auth.guard.ts`)
   - Validates JWT tokens for protected routes
   - Extracts user information from tokens
   - Provides authentication for downstream services

4. **Logging Interceptor** (`common/interceptors/logging.interceptor.ts`)
   - Logs all HTTP requests and responses
   - Measures response times
   - Provides monitoring and debugging capabilities

## Configuration

### Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Microservices URLs
AUTH_SERVICE_URL=http://localhost:3000
USER_SERVICE_URL=http://localhost:3002
TELEGRAM_SERVICE_URL=http://localhost:3003
```

### Rate Limiting

The API Gateway implements rate limiting to prevent abuse:
- **TTL**: 60 seconds (configurable)
- **Limit**: 100 requests per window (configurable)
- **Scope**: Applied globally to all routes

## API Endpoints

### Public Endpoints

#### Health Check
```
GET /health
```
Returns the health status of the API Gateway.

#### Root Endpoint
```
GET /
```
Returns basic information about the API Gateway.

#### Swagger Documentation
```
GET /api
```
Access the interactive API documentation.

### Protected Endpoints

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

#### Authentication Routes
```
POST /gateway/auth/login
POST /gateway/auth/register
POST /gateway/auth/refresh
```

#### User Management Routes
```
GET /gateway/users/profile
PUT /gateway/users/profile
GET /gateway/users
```

#### Telegram Bot Routes
```
POST /gateway/telegram/send-message
GET /gateway/telegram/status
```

## Request Flow

1. **Client Request**: Client sends HTTP request to API Gateway
2. **Authentication**: JWT Auth Guard validates token (if required)
3. **Rate Limiting**: Throttler checks rate limits
4. **Routing**: Gateway Service determines target microservice
5. **Forwarding**: Request is forwarded to appropriate microservice
6. **Response**: Response is returned to client
7. **Logging**: Logging Interceptor logs request details

## Error Handling

### Authentication Errors
- **401 Unauthorized**: Invalid or missing JWT token
- **403 Forbidden**: Insufficient permissions

### Rate Limiting Errors
- **429 Too Many Requests**: Rate limit exceeded

### Routing Errors
- **404 Not Found**: Route not found
- **502 Bad Gateway**: Microservice unavailable

### Validation Errors
- **400 Bad Request**: Invalid request data
- **422 Unprocessable Entity**: Validation failed

## Security Features

### JWT Authentication
- Token-based authentication
- Configurable expiration times
- Secure token validation

### Rate Limiting
- Prevents API abuse
- Configurable limits per time window
- Global application

### CORS Configuration
- Cross-origin resource sharing
- Configurable allowed origins
- Secure by default

## Monitoring and Logging

### Request Logging
All requests are logged with the following format:
```
METHOD URL STATUS_CODE RESPONSE_TIME
```

Example:
```
GET /gateway/auth/login 200 45ms
POST /gateway/users/profile 401 12ms
```

### Health Monitoring
- Health check endpoint for monitoring
- Service status reporting
- Dependency health checks

## Development

### Running the Gateway

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Start production server
npm run start:prod

# Run tests
npm test
```

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e
```

### Building

```bash
# Build for production
npm run build

# Format code
npm run format

# Lint code
npm run lint
```

## Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]
```

### Environment Configuration

Ensure all required environment variables are set:
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 3001)
- `THROTTLE_TTL`: Rate limiting time window
- `THROTTLE_LIMIT`: Rate limiting request limit

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Check if port 3001 is available
   - Change PORT environment variable if needed

2. **JWT Token Issues**
   - Verify JWT_SECRET is set correctly
   - Check token expiration
   - Ensure proper token format

3. **Microservice Connection Issues**
   - Verify microservices are running
   - Check network connectivity
   - Review service URLs in configuration

4. **Rate Limiting Issues**
   - Adjust THROTTLE_TTL and THROTTLE_LIMIT
   - Check if requests are being throttled correctly

### Debug Mode

Enable debug mode for detailed logging:
```bash
npm run start:debug
```

## Performance Optimization

### Caching
- Implement Redis caching for frequently accessed data
- Cache JWT token validation results
- Cache microservice responses

### Load Balancing
- Use multiple gateway instances
- Implement round-robin load balancing
- Add health checks for load balancer

### Monitoring
- Implement metrics collection
- Add performance monitoring
- Set up alerting for errors

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Run linting before committing
5. Ensure all tests pass

## License

This project is part of the Telegram Automation system and follows the same licensing terms. 