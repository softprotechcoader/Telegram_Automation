# API Gateway Package Dependencies

This document explains the dependencies used in the API Gateway project and their purposes.

## Core Dependencies

### NestJS Framework
- **@nestjs/common**: Core NestJS decorators, interfaces, and utilities
- **@nestjs/config**: Environment variable management and configuration
- **@nestjs/core**: Core NestJS framework functionality
- **@nestjs/platform-express**: Express.js integration for HTTP server

### Authentication and Security
- **@nestjs/jwt**: JWT token generation and validation
- **@nestjs/passport**: Passport.js integration for authentication strategies
- **passport**: Authentication middleware for Node.js
- **passport-jwt**: JWT strategy for Passport.js
- **bcrypt**: Password hashing and verification

### Microservices and Communication
- **@nestjs/microservices**: Microservices communication utilities
- **@nestjs/websockets**: WebSocket support for real-time communication
- **axios**: HTTP client for making requests to microservices
- **http-proxy-middleware**: Proxy middleware for request forwarding

### API Documentation and Validation
- **@nestjs/swagger**: Swagger/OpenAPI documentation generation
- **class-transformer**: Object transformation utilities
- **class-validator**: Validation decorators and utilities

### Rate Limiting and Protection
- **@nestjs/throttler**: Rate limiting to prevent API abuse

### Core Dependencies
- **reflect-metadata**: Metadata reflection for decorators
- **rxjs**: Reactive programming library for observables

## Development Dependencies

### NestJS Development Tools
- **@nestjs/cli**: NestJS command-line interface
- **@nestjs/schematics**: Code generation schematics
- **@nestjs/testing**: Testing utilities for NestJS

### TypeScript and Type Definitions
- **@types/express**: TypeScript definitions for Express.js
- **@types/jest**: TypeScript definitions for Jest
- **@types/node**: TypeScript definitions for Node.js
- **@types/supertest**: TypeScript definitions for Supertest
- **typescript**: TypeScript compiler
- **ts-node**: TypeScript execution engine
- **ts-loader**: TypeScript loader for webpack
- **tsconfig-paths**: TypeScript path mapping

### Code Quality and Formatting
- **@typescript-eslint/eslint-plugin**: ESLint plugin for TypeScript
- **@typescript-eslint/parser**: TypeScript parser for ESLint
- **eslint**: JavaScript/TypeScript linting tool
- **eslint-config-prettier**: ESLint configuration for Prettier
- **eslint-plugin-prettier**: Prettier integration for ESLint
- **prettier**: Code formatter

### Testing Framework
- **jest**: JavaScript testing framework
- **ts-jest**: TypeScript support for Jest
- **supertest**: HTTP assertion library for testing

### Development Utilities
- **source-map-support**: Source map support for debugging

## Scripts

- **build**: Compiles the TypeScript code
- **format**: Formats code using Prettier
- **start**: Starts the application in production mode
- **start:dev**: Starts the application in development mode with watch
- **start:debug**: Starts the application in debug mode
- **start:prod**: Runs the compiled application
- **lint**: Runs ESLint with auto-fix
- **test**: Runs Jest tests
- **test:watch**: Runs tests in watch mode
- **test:cov**: Runs tests with coverage
- **test:debug**: Runs tests in debug mode
- **test:e2e**: Runs end-to-end tests

## Usage

To install dependencies:
```bash
npm install
```

To start development server:
```bash
npm run start:dev
```

To run tests:
```bash
npm test
```

To build for production:
```bash
npm run build
``` 