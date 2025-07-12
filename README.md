# Telegram Automation Web

A comprehensive NestJS-based authentication and authorization system for Telegram Automation with advanced multi-role support and role-based access control.

## 🚀 Features

### ✅ **Multi-Role Authentication System**
- **Multiple roles per user**: Local, Admin, Super_Admin
- **Separate role tables**: Organized data structure
- **Role-based authorization**: Granular permission control
- **JWT token authentication**: Secure stateless authentication

### ✅ **Advanced Authorization**
- **Role filtering**: Admin users can't see super_admin users
- **Password recovery**: All users can update their own profiles
- **Flexible permissions**: Different access levels per role
- **Security-first approach**: Comprehensive input validation

### ✅ **Database Integration**
- **Microsoft SQL Server**: Primary database
- **Windows Authentication**: NTLM support
- **TypeORM integration**: Efficient data management
- **Cascade relationships**: Proper data integrity

### ✅ **API Documentation**
- **Swagger/OpenAPI**: Interactive API documentation
- **Comprehensive schemas**: Detailed request/response models
- **Bearer token support**: JWT authentication documentation
- **Health check endpoint**: System monitoring

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Role System](#role-system)
- [Testing](#testing)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Microsoft SQL Server
- SQL Server Management Studio (SSMS)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Telegram_Automation_Web

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Edit .env file with your database settings

# Run database setup
# Execute create-multi-role-tables.sql in SSMS

# Start the application
npm run dev
```

### Access the Application
- **Application**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/

## ⚙️ Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DB_TYPE=mssql
DB_HOST=MYHPPC\SQLEXPRESS
DB_PORT=1433
DB_NAME=telegram_automation
DB_AUTH_TYPE=ntlm

# JWT Configuration
JWT_SECRET=your-secret-key-here

# Application Configuration
PORT=3000
NODE_ENV=development
```

### 3. Database Setup
1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your database: `MYHPPC\SQLEXPRESS`
3. Open the file: `create-multi-role-tables.sql`
4. Execute the script

### 4. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm run start

# Build the application
npm run build
```

## 🔧 Configuration

### Database Configuration
The application supports Microsoft SQL Server with Windows Authentication:

```env
DB_TYPE=mssql
DB_HOST=MYHPPC\SQLEXPRESS
DB_PORT=1433
DB_NAME=telegram_automation
DB_AUTH_TYPE=ntlm
```

### JWT Configuration
```env
JWT_SECRET=your-secret-key-here
```

### Application Configuration
```env
PORT=3000
NODE_ENV=development
```

## 🗄️ Database Setup

### Database Schema
The application uses a multi-table approach for role management:

#### **Main Tables:**
1. **`users`** - Base user information
2. **`local_users`** - Local user specific data
3. **`admin_users`** - Admin user specific data
4. **`super_admin_users`** - Super admin specific data

#### **Sample Users:**
| User | Email | Password | Roles |
|------|-------|----------|-------|
| John Doe | john.doe@example.com | Admin@123 | Local + Admin |
| Jane Smith | jane.smith@example.com | Admin@123 | Local only |
| Super Admin | superadmin@telegramautomation.com | SuperAdmin@123 | All roles |

### Database Scripts
- **`create-multi-role-tables.sql`** - Complete database setup
- **`test-mssql-connection.js`** - Database connection test
- **`test-admin-login.js`** - Admin login test

## 📡 API Endpoints

### Public Endpoints
```http
POST /auth/register    # Register new user with optional roles
POST /auth/login       # Login and receive JWT token
GET  /                 # Health check endpoint
```

### Authenticated Endpoints
```http
GET  /auth/profile     # Get current user profile
PUT  /auth/users/:id   # Update user (own profile or admin/super_admin)
GET  /auth/users       # Get users list (admin/super_admin with filtering)
```

### Authorization Matrix
| Endpoint | Local User | Admin User | Super Admin |
|----------|------------|------------|-------------|
| `/auth/register` | ✅ Public | ✅ Public | ✅ Public |
| `/auth/login` | ✅ Public | ✅ Public | ✅ Public |
| `/auth/profile` | ✅ Own only | ✅ Own only | ✅ Own only |
| `PUT /auth/users/:id` | ✅ Own only | ✅ Any user | ✅ Any user |
| `GET /auth/users` | ❌ No access | ✅ Local + Admin users | ✅ All users |

## 👥 Role System

### Role Types
- **`local`** - Basic user with limited access
- **`admin`** - Administrator with user management access
- **`super_admin`** - Super administrator with full system access

### Role Features
- **Multi-role support**: Users can have multiple roles simultaneously
- **Role filtering**: Admin users can't see super_admin users
- **Granular permissions**: Each role has specific capabilities
- **Flexible assignment**: Easy to add/remove roles

### Permission Matrix
| Feature | Local User | Admin User | Super Admin |
|---------|------------|------------|-------------|
| Basic Access | ✅ | ✅ | ✅ |
| Profile Management | ✅ Own only | ✅ Own only | ✅ Own only |
| User Management | ❌ | ✅ (Local + Admin users) | ✅ (All users) |
| Content Moderation | ❌ | ✅ | ✅ |
| System Administration | ❌ | ❌ | ✅ |
| Emergency Access | ❌ | ❌ | ✅ |
| Password Recovery | ✅ Own only | ✅ Any user | ✅ Any user |

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

### Test via cURL
```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "roles": ["local"]
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📚 Documentation

### Project Documentation
- **[MULTI_ROLE_SYSTEM.md](./MULTI_ROLE_SYSTEM.md)** - Comprehensive multi-role system guide
- **[ADMIN_SETUP.md](./ADMIN_SETUP.md)** - Admin user setup and configuration
- **[API Documentation](./src/auth/auth.controller.ts)** - Detailed API documentation with Swagger

### Code Documentation
All code files include comprehensive comments explaining:
- **Purpose and functionality** of each component
- **Security considerations** and best practices
- **Usage examples** and implementation details
- **Configuration options** and customization

### Key Documentation Files
- **`src/main.ts`** - Application bootstrap and configuration
- **`src/app.module.ts`** - Main application module setup
- **`src/auth/auth.service.ts`** - Authentication business logic
- **`src/auth/auth.controller.ts`** - API endpoints and documentation
- **`src/auth/entities/`** - Database entity definitions
- **`src/auth/guards/`** - Authorization guards
- **`src/auth/strategies/`** - JWT authentication strategy

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Test database connection
node test-mssql-connection.js

# Check environment variables
echo $DB_HOST
echo $DB_NAME
```

#### Authentication Issues
```bash
# Test admin login
node test-admin-login.js

# Check JWT token validity
# Tokens expire after 1 day
```

#### Role-Based Access Issues
- **Admin users** should not see super_admin users in `/auth/users`
- **Super admin users** should see all users
- **Multi-role users** should be handled correctly
- Check the role filtering logic in the service

### Error Messages

#### "User not found"
- Ensure the SQL script ran successfully
- Check database connection in your `.env` file
- Verify the database exists: `telegram_automation`

#### "Invalid credentials"
- Verify you're using the correct email/password
- Check that the password hashes were generated correctly
- Ensure bcrypt is working properly

#### "Unauthorized"
- Make sure you're including the JWT token in the Authorization header
- Format: `Bearer <your-jwt-token>`
- Check if the token has expired (1 day validity)

#### "Forbidden"
- Verify you have the required roles for the endpoint
- Check if you're trying to access data outside your permission level
- Ensure role-based filtering is working correctly

## 🛡️ Security Features

### Authentication Security
- **bcrypt password hashing** with salt rounds of 10
- **JWT token authentication** with 1-day expiration
- **Input validation** on all endpoints
- **Password never returned** in API responses

### Authorization Security
- **Role-based access control** with granular permissions
- **Role filtering** prevents unauthorized data access
- **Multi-role support** with proper authorization
- **Security-first approach** in all implementations

### Database Security
- **Windows Authentication** support
- **Foreign key constraints** with cascade deletes
- **Separate role tables** for data isolation
- **Proper indexing** for performance

## 🚀 Development

### Available Scripts
```bash
npm run dev      # Development with nodemon
npm run start    # Production start
npm run build    # TypeScript compilation
npm run test     # Run tests
```

### Code Structure
```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Main application module
├── app.controller.ts       # Root controller
└── auth/                   # Authentication module
    ├── auth.module.ts      # Auth module configuration
    ├── auth.controller.ts  # Auth endpoints
    ├── auth.service.ts     # Auth business logic
    ├── dto/               # Data transfer objects
    ├── entities/          # Database entities
    ├── guards/            # Authorization guards
    └── strategies/        # Authentication strategies
```

### Adding New Features
1. **Create new entities** in `src/auth/entities/`
2. **Add DTOs** in `src/auth/dto/`
3. **Update services** in `src/auth/auth.service.ts`
4. **Add endpoints** in `src/auth/auth.controller.ts`
5. **Update documentation** in markdown files

## 📞 Support

For issues or questions:
1. Check the console logs for error messages
2. Verify database connectivity
3. Test with the provided test scripts
4. Review the authentication flow in the code comments
5. Check the role filtering logic
6. Verify JWT token validity

## 📄 License

This project is licensed under the MIT License.

---

**🎉 Your Telegram Automation Web application is ready with comprehensive multi-role support and advanced authorization controls!** 