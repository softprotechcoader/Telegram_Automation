# API Gateway Testing Guide

This document provides comprehensive testing instructions for the Telegram Automation API Gateway.

## 🚀 Service Status

### **Running Services:**
- **Auth Service**: http://localhost:3000 (Original authentication service)
- **API Gateway**: http://localhost:3001 (New microservices gateway)

### **API Gateway Endpoints:**
- **Health Check**: http://localhost:3001/health
- **Root**: http://localhost:3001/
- **Swagger Documentation**: http://localhost:3001/api
- **Gateway Routes**: http://localhost:3001/gateway/*

## 📋 Test Cases

### **1. Health Check Tests**

#### **Test 1.1: Root Health Check**
```bash
curl http://localhost:3001/
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "service": "api-gateway",
  "version": "1.0.0"
}
```

#### **Test 1.2: Health Endpoint**
```bash
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "service": "api-gateway",
  "version": "1.0.0"
}
```

### **2. Swagger Documentation Test**

#### **Test 2.1: Access Swagger UI**
- Open browser: http://localhost:3001/api
- Verify all endpoints are documented
- Check authentication setup (Bearer token)

### **3. Gateway Routing Tests**

#### **Test 3.1: Auth Service Routing (Public)**
```bash
# Test login endpoint through gateway
curl -X POST http://localhost:3001/gateway/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "Admin@123"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["local", "admin"]
  }
}
```

#### **Test 3.2: Auth Service Routing (Register)**
```bash
# Test registration endpoint through gateway
curl -X POST http://localhost:3001/gateway/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "firstName": "Test",
    "lastName": "User",
    "roles": ["local"]
  }'
```

#### **Test 3.3: User Service Routing (Protected)**
```bash
# First, get a token
TOKEN=$(curl -s -X POST http://localhost:3001/gateway/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "Admin@123"
  }' | jq -r '.access_token')

# Test user profile endpoint through gateway
curl -X GET http://localhost:3001/gateway/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

#### **Test 3.4: Telegram Service Routing (Protected)**
```bash
# Test telegram bot endpoint through gateway
curl -X POST http://localhost:3001/gateway/telegram/send-message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "123456789",
    "message": "Hello from API Gateway!"
  }'
```

### **4. Error Handling Tests**

#### **Test 4.1: Invalid Token**
```bash
curl -X GET http://localhost:3001/gateway/users/profile \
  -H "Authorization: Bearer invalid-token"
```

**Expected Response:**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

#### **Test 4.2: Missing Token**
```bash
curl -X GET http://localhost:3001/gateway/users/profile
```

**Expected Response:**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

#### **Test 4.3: Service Unavailable**
```bash
# Test with non-existent service
curl -X GET http://localhost:3001/gateway/nonexistent/test
```

**Expected Response:**
```json
{
  "message": "Service not found",
  "statusCode": 404
}
```

### **5. Performance Tests**

#### **Test 5.1: Response Time**
```bash
# Test response time for health check
time curl http://localhost:3001/health
```

#### **Test 5.2: Load Test**
```bash
# Test multiple concurrent requests
for i in {1..10}; do
  curl -s http://localhost:3001/health &
done
wait
```

### **6. CORS Tests**

#### **Test 6.1: CORS Headers**
```bash
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  -X OPTIONS http://localhost:3001/health
```

**Expected Headers:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
Access-Control-Allow-Headers: *
```

## 🧪 Automated Testing Scripts

### **Test Script 1: Basic Health Check**
```bash
#!/bin/bash
echo "Testing API Gateway Health..."

# Test root endpoint
echo "1. Testing root endpoint..."
ROOT_RESPONSE=$(curl -s http://localhost:3001/)
if [[ $ROOT_RESPONSE == *"healthy"* ]]; then
    echo "✅ Root endpoint working"
else
    echo "❌ Root endpoint failed"
fi

# Test health endpoint
echo "2. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/health)
if [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
    echo "✅ Health endpoint working"
else
    echo "❌ Health endpoint failed"
fi

echo "Health check tests completed!"
```

### **Test Script 2: Authentication Flow**
```bash
#!/bin/bash
echo "Testing Authentication Flow..."

# Test login through gateway
echo "1. Testing login through gateway..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/gateway/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "Admin@123"
  }')

if [[ $LOGIN_RESPONSE == *"access_token"* ]]; then
    echo "✅ Login successful"
    TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')
    
    # Test protected endpoint
    echo "2. Testing protected endpoint..."
    PROFILE_RESPONSE=$(curl -s -X GET http://localhost:3001/gateway/users/profile \
      -H "Authorization: Bearer $TOKEN")
    
    if [[ $PROFILE_RESPONSE == *"Unauthorized"* ]]; then
        echo "❌ Protected endpoint failed"
    else
        echo "✅ Protected endpoint working"
    fi
else
    echo "❌ Login failed"
fi

echo "Authentication flow tests completed!"
```

## 🔧 Manual Testing Checklist

### **Pre-Test Setup:**
- [ ] Auth Service running on port 3000
- [ ] API Gateway running on port 3001
- [ ] Database connection established
- [ ] Test users created in database

### **Health Check Tests:**
- [ ] Root endpoint returns healthy status
- [ ] Health endpoint returns healthy status
- [ ] Response includes timestamp and version
- [ ] Response time is under 100ms

### **Swagger Documentation:**
- [ ] Swagger UI accessible at /api
- [ ] All endpoints documented
- [ ] Authentication setup visible
- [ ] Try it out functionality works

### **Gateway Routing:**
- [ ] Auth service routes work (/gateway/auth/*)
- [ ] User service routes work (/gateway/users/*)
- [ ] Telegram service routes work (/gateway/telegram/*)
- [ ] Error handling for invalid routes

### **Authentication:**
- [ ] Public endpoints accessible without token
- [ ] Protected endpoints require valid token
- [ ] Invalid tokens return 401
- [ ] Missing tokens return 401

### **Error Handling:**
- [ ] 404 for non-existent routes
- [ ] 401 for unauthorized access
- [ ] 500 for service errors
- [ ] Proper error messages

### **Performance:**
- [ ] Response time under 200ms for health checks
- [ ] Response time under 1000ms for auth operations
- [ ] No memory leaks during testing
- [ ] Concurrent requests handled properly

## 📊 Expected Results

### **Success Criteria:**
- ✅ All health checks pass
- ✅ Swagger documentation accessible
- ✅ Authentication flow works end-to-end
- ✅ Gateway routes requests correctly
- ✅ Error handling works as expected
- ✅ Performance meets requirements

### **Failure Indicators:**
- ❌ Health checks return errors
- ❌ Swagger UI not accessible
- ❌ Authentication fails
- ❌ Gateway doesn't route requests
- ❌ Poor error messages
- ❌ Slow response times

## 🚨 Troubleshooting

### **Common Issues:**

1. **Port Conflicts:**
   ```bash
   # Check what's running on ports
   netstat -ano | findstr :3000
   netstat -ano | findstr :3001
   ```

2. **Service Not Starting:**
   ```bash
   # Check logs
   npm run start:dev
   ```

3. **Database Connection:**
   ```bash
   # Test database connection
   node test-mssql-connection.js
   ```

4. **CORS Issues:**
   - Check browser console for CORS errors
   - Verify CORS configuration in main.ts

5. **Authentication Issues:**
   - Verify JWT_SECRET is set
   - Check token format in requests
   - Validate token expiration

## 📝 Test Report Template

### **Test Report:**
```
Date: _______________
Tester: _______________
Environment: Development

✅ Health Checks: PASS/FAIL
✅ Swagger Documentation: PASS/FAIL
✅ Authentication Flow: PASS/FAIL
✅ Gateway Routing: PASS/FAIL
✅ Error Handling: PASS/FAIL
✅ Performance: PASS/FAIL

Issues Found:
1. ________________
2. ________________

Recommendations:
1. ________________
2. ________________
```

This testing guide ensures comprehensive validation of your API Gateway functionality! 