# API Documentation

Comprehensive API documentation for the Telegram Automation Web authentication and authorization system.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Testing](#testing)

## 🔍 Overview

The API provides a comprehensive authentication and authorization system with multi-role support. All endpoints are RESTful and return JSON responses.

### Base URL
```
http://localhost:3000
```

### API Documentation
Interactive API documentation is available at:
```
http://localhost:3000/api
```

## 🔐 Authentication

### JWT Token Authentication
The API uses JWT (JSON Web Tokens) for authentication. Tokens are valid for 1 day.

### Token Format
```
Authorization: Bearer <your-jwt-token>
```

### Token Response Format
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["local", "admin"]
  }
}
```

## 📡 Endpoints

### Public Endpoints

#### 1. Health Check
```http
GET /
```

**Response:**
```json
{
  "message": "API is running",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "status": "healthy"
}
```

#### 2. Register User
```http
POST /auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["local", "admin"]
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["local", "admin"],
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### 3. Login User
```http
POST /auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["local", "admin"]
  }
}
```

### Authenticated Endpoints

#### 4. Get User Profile
```http
GET /auth/profile
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["local", "admin"],
  "isActive": true,
  "lastLogin": "2023-01-01T00:00:00.000Z",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### 5. Update User
```http
PUT /auth/users/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "password": "newSecurePassword123"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "Updated",
  "lastName": "Name",
  "roles": ["local", "admin"],
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### 6. Get All Users (Admin/Super Admin Only)
```http
GET /auth/users
Authorization: Bearer <jwt-token>
```

**Response (Admin User):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["local", "admin"],
    "isActive": true,
    "lastLogin": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": "456e7890-e89b-12d3-a456-426614174000",
    "email": "jane.smith@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "roles": ["local"],
    "isActive": true,
    "lastLogin": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

**Response (Super Admin User):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["local", "admin"],
    "isActive": true,
    "lastLogin": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": "456e7890-e89b-12d3-a456-426614174000",
    "email": "jane.smith@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "roles": ["local"],
    "isActive": true,
    "lastLogin": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": "789e0123-e89b-12d3-a456-426614174000",
    "email": "superadmin@telegramautomation.com",
    "firstName": "Super",
    "lastName": "Admin",
    "roles": ["local", "admin", "super_admin"],
    "isActive": true,
    "lastLogin": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

## 📊 Data Models

### User Model
```typescript
interface User {
  id: string;                    // UUID
  email: string;                 // Unique email address
  firstName: string;             // User's first name
  lastName: string;              // User's last name
  roles: string[];               // Array of user roles
  isActive: boolean;             // Account status
  lastLogin?: Date;              // Last login timestamp
  createdAt: Date;               // Account creation date
  updatedAt: Date;               // Last update date
}
```

### Role Types
- **`local`** - Basic user with limited access
- **`admin`** - Administrator with user management access
- **`super_admin`** - Super administrator with full system access

### Register Request
```typescript
interface RegisterRequest {
  email: string;                 // Required, valid email
  password: string;              // Required, min 8 characters
  firstName: string;             // Required
  lastName: string;              // Required
  roles?: string[];              // Optional, defaults to ['local']
}
```

### Login Request
```typescript
interface LoginRequest {
  email: string;                 // Required, valid email
  password: string;              // Required
}
```

### Update User Request
```typescript
interface UpdateUserRequest {
  firstName?: string;            // Optional
  lastName?: string;             // Optional
  password?: string;             // Optional, min 8 characters
}
```

## ⚠️ Error Handling

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Common Error Codes

#### 400 Bad Request
- Invalid email format
- Password too short (minimum 8 characters)
- Missing required fields
- User already exists

#### 401 Unauthorized
- Invalid JWT token
- Missing Authorization header
- Expired token

#### 403 Forbidden
- Insufficient permissions
- Trying to access data outside permission level
- Can only update own profile

#### 404 Not Found
- User not found
- Endpoint not found

### Error Examples

#### Invalid Email
```json
{
  "statusCode": 400,
  "message": ["Please provide a valid email address"],
  "error": "Bad Request"
}
```

#### User Not Found
```json
{
  "statusCode": 400,
  "message": "User not found",
  "error": "Bad Request"
}
```

#### Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only update your own profile",
  "error": "Forbidden"
}
```

## 🧪 Examples

### Complete User Registration and Login Flow

#### Step 1: Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securePassword123",
    "firstName": "New",
    "lastName": "User",
    "roles": ["local", "admin"]
  }'
```

#### Step 2: Login with the new user
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securePassword123"
  }'
```

#### Step 3: Get user profile
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <jwt-token-from-step-2>"
```

#### Step 4: Update user profile
```bash
curl -X PUT http://localhost:3000/auth/users/<user-id> \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'
```

#### Step 5: Get all users (admin only)
```bash
curl -X GET http://localhost:3000/auth/users \
  -H "Authorization: Bearer <jwt-token>"
```

### Testing with Sample Users

#### Admin User Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@telegramautomation.com",
    "password": "Admin@123"
  }'
```

#### Super Admin User Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@telegramautomation.com",
    "password": "SuperAdmin@123"
  }'
```

#### Multi-Role User Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "Admin@123"
  }'
```

## 🧪 Testing

### Test Database Connection
```bash
node test-mssql-connection.js
```

### Test Admin Login
```bash
node test-admin-login.js
```

### Test via Swagger UI
1. Start the application: `npm run dev`
2. Open: http://localhost:3000/api
3. Test endpoints with sample data

### Test via Postman
1. Import the API collection
2. Set the base URL to: `http://localhost:3000`
3. Use the provided sample data for testing

### Test via cURL
All examples above can be run with cURL commands.

## 🔐 Authorization Rules

### Role-Based Access Matrix

| Endpoint | Local User | Admin User | Super Admin |
|----------|------------|------------|-------------|
| `POST /auth/register` | ✅ Public | ✅ Public | ✅ Public |
| `POST /auth/login` | ✅ Public | ✅ Public | ✅ Public |
| `GET /auth/profile` | ✅ Own only | ✅ Own only | ✅ Own only |
| `PUT /auth/users/:id` | ✅ Own only | ✅ Any user | ✅ Any user |
| `GET /auth/users` | ❌ No access | ✅ Local + Admin users | ✅ All users |

### Data Access Rules
- **Local users**: Can only access their own profile
- **Admin users**: Can see local and admin users (excludes super_admin)
- **Super admin users**: Can see and manage all users
- **Multi-role users**: Handled correctly with proper filtering

## 📞 Support

For API-related issues:
1. Check the Swagger documentation at `/api`
2. Review the error messages and status codes
3. Verify your JWT token is valid and not expired
4. Ensure you have the required roles for the endpoint
5. Check the request format and required fields

---

**🎉 The API is ready for use with comprehensive authentication and authorization!** 