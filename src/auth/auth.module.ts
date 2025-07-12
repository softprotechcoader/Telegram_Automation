import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { LocalUser } from './entities/local-user.entity';
import { AdminUser } from './entities/admin-user.entity';
import { SuperAdminUser } from './entities/super-admin-user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

/**
 * Authentication module
 * Configures all authentication-related components including:
 * - User entity for database operations
 * - Role-specific entities (LocalUser, AdminUser, SuperAdminUser)
 * - JWT authentication strategy
 * - Passport for authentication
 * - Role-based authorization guard
 */
@Module({
  imports: [
    // Register all entities for TypeORM operations
    TypeOrmModule.forFeature([
      User,
      LocalUser,
      AdminUser,
      SuperAdminUser
    ]),
    
    // Import Passport module for authentication strategies
    PassportModule,
    
    // Configure JWT module for token generation and validation
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // JWT signing secret
      signOptions: { expiresIn: '1d' }, // Token expires in 1 day
    }),
  ],
  controllers: [AuthController], // Register authentication controller
  providers: [
    AuthService,     // Authentication business logic
    JwtStrategy,     // JWT token validation strategy
    RolesGuard,      // Role-based authorization guard
  ],
  exports: [AuthService], // Export AuthService for use in other modules
})
export class AuthModule {} 