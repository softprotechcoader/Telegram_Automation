import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LocalUser } from '../entities/local-user.entity';
import { AdminUser } from '../entities/admin-user.entity';
import { SuperAdminUser } from '../entities/super-admin-user.entity';

/**
 * JWT Strategy for Passport authentication
 * Validates JWT tokens and loads user information from the database
 * Supports multi-role system with separate role tables
 * Used by JwtAuthGuard to protect routes
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LocalUser)
    private localUserRepository: Repository<LocalUser>,
    @InjectRepository(AdminUser)
    private adminUserRepository: Repository<AdminUser>,
    @InjectRepository(SuperAdminUser)
    private superAdminUserRepository: Repository<SuperAdminUser>,
  ) {
    super({
      // Extract JWT token from Authorization header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Secret key for verifying JWT signatures
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key', // Use environment variable in production
    });
  }

  /**
   * Validates JWT payload and returns user information with roles
   * Called automatically by Passport when a JWT token is present
   * 
   * @param payload - Decoded JWT payload containing user information
   * @returns User object with roles if valid, throws UnauthorizedException if invalid
   * @throws UnauthorizedException if user not found in database
   */
  async validate(payload: any) {
    const { id } = payload;
    
    // Find user in database by ID from JWT payload
    const user = await this.userRepository.findOne({ where: { id } });

    // If user not found, token is invalid
    if (!user) {
      throw new UnauthorizedException();
    }

    // Get user roles from separate role tables
    const roles = await this.getUserRoles(id);

    // Return user object with roles (will be attached to request as req.user)
    return { ...user, roles };
  }

  /**
   * Get all roles for a specific user
   * 
   * @param userId - User ID to get roles for
   * @returns Array of role strings
   */
  private async getUserRoles(userId: string): Promise<string[]> {
    const roles: string[] = [];

    // Check if user is a local user
    const localUser = await this.localUserRepository.findOne({ 
      where: { userId, isActive: true } 
    });
    if (localUser) roles.push('local');

    // Check if user is an admin user
    const adminUser = await this.adminUserRepository.findOne({ 
      where: { userId, isActive: true } 
    });
    if (adminUser) roles.push('admin');

    // Check if user is a super admin user
    const superAdminUser = await this.superAdminUserRepository.findOne({ 
      where: { userId, isActive: true } 
    });
    if (superAdminUser) roles.push('super_admin');

    return roles;
  }
} 