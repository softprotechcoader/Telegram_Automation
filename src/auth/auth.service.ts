import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LocalUser } from './entities/local-user.entity';
import { AdminUser } from './entities/admin-user.entity';
import { SuperAdminUser } from './entities/super-admin-user.entity';
import { RegisterDto, LoginDto, UpdateUserDto } from './dto/auth.dto';

/**
 * Authentication service
 * Handles user registration, login, and user management operations
 * Includes password hashing, JWT token generation, and user validation
 * Supports multi-role system with separate tables for different user types
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LocalUser)
    private localUserRepository: Repository<LocalUser>,
    @InjectRepository(AdminUser)
    private adminUserRepository: Repository<AdminUser>,
    @InjectRepository(SuperAdminUser)
    private superAdminUserRepository: Repository<SuperAdminUser>,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new user with optional role assignments
   * Creates a new user account with hashed password and assigns roles
   * 
   * @param registerDto - User registration data with optional roles
   * @returns Created user object (password excluded)
   * @throws BadRequestException if user already exists
   */
  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, roles = [] } = registerDto;

    // Check if user already exists with the same email
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash the password using bcrypt with salt rounds of 10
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user entity
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Save the user to the database
    await this.userRepository.save(user);
    
    // Assign roles if specified
    if (roles.length > 0) {
      await this.assignRolesToUser(user.id, roles);
    } else {
      // Default to local user if no roles specified
      await this.assignRolesToUser(user.id, ['local']);
    }
    
    // Return user object without password for security
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * Authenticate user and generate JWT token
   * Validates user credentials and returns access token with user roles
   * 
   * @param loginDto - User login credentials
   * @returns JWT access token and user information with roles
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user roles
    const userRoles = await this.getUserRoles(user.id);

    // Update last login timestamp
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    // Generate JWT payload with user information and roles
    const payload = { 
      id: user.id, 
      email: user.email, 
      roles: userRoles 
    };
    
    // Return JWT token and user information with roles
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: userRoles,
      },
    };
  }

  /**
   * Find all users with their roles
   * Retrieves all users in the system with their role information
   * 
   * @returns Array of user objects with roles (passwords excluded)
   */
  async findAll() {
    const users = await this.userRepository.find();
    
    // Get roles for each user
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        const { password: _, ...userWithoutPassword } = user;
        const roles = await this.getUserRoles(user.id);
        return { ...userWithoutPassword, roles };
      })
    );
    
    return usersWithRoles;
  }

  /**
   * Find users by specific roles
   * Retrieves users that have any of the specified roles
   * 
   * @param roles - Array of role strings to filter by
   * @returns Array of user objects with roles (passwords excluded)
   */
  async findUsersByRoles(roles: string[]) {
    const allUsers = await this.userRepository.find();
    const filteredUsers = [];

    for (const user of allUsers) {
      const userRoles = await this.getUserRoles(user.id);
      
      // Check if user has any of the specified roles
      const hasRequiredRole = roles.some(role => userRoles.includes(role));
      
      // Additional check: If we're filtering for admin users (not super_admin),
      // exclude any users who have super_admin role
      const isSuperAdminUser = userRoles.includes('super_admin');
      const isAdminOnlyRequest = roles.includes('admin') && !roles.includes('super_admin');
      
      // Include user if they have required roles AND
      // either it's not an admin-only request OR the user is not a super_admin
      if (hasRequiredRole && (!isAdminOnlyRequest || !isSuperAdminUser)) {
        const { password: _, ...userWithoutPassword } = user;
        filteredUsers.push({ ...userWithoutPassword, roles: userRoles });
      }
    }
    
    return filteredUsers;
  }

  /**
   * Update user information
   * Allows updating user details and password
   * 
   * @param userId - ID of the user to update
   * @param updateUserDto - User data to update
   * @returns Updated user object (password excluded)
   * @throws BadRequestException if user not found
   */
  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    // Find user by ID
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Hash new password if provided
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update user properties
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    // Return updated user without password
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * Find user by ID with roles
   * Retrieves user information by unique ID including all roles
   * 
   * @param id - User ID to find
   * @returns User object with roles (password excluded)
   * @throws BadRequestException if user not found
   */
  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    // Get user roles
    const userRoles = await this.getUserRoles(id);
    
    // Return user without password and with roles
    const { password: _, ...result } = user;
    return { ...result, roles: userRoles };
  }

  /**
   * Get all roles for a specific user
   * 
   * @param userId - User ID to get roles for
   * @returns Array of role strings
   */
  async getUserRoles(userId: string): Promise<string[]> {
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

  /**
   * Assign roles to a user
   * 
   * @param userId - User ID to assign roles to
   * @param roles - Array of role strings to assign
   */
  async assignRolesToUser(userId: string, roles: string[]) {
    for (const role of roles) {
      switch (role.toLowerCase()) {
        case 'local':
          await this.createLocalUser(userId);
          break;
        case 'admin':
          await this.createAdminUser(userId);
          break;
        case 'super_admin':
          await this.createSuperAdminUser(userId);
          break;
      }
    }
  }

  /**
   * Create a local user record
   * 
   * @param userId - User ID to create local user for
   */
  private async createLocalUser(userId: string) {
    const existingLocalUser = await this.localUserRepository.findOne({ 
      where: { userId } 
    });
    
    if (!existingLocalUser) {
      const localUser = this.localUserRepository.create({
        userId,
        permissions: 'basic_access',
        isActive: true,
      });
      await this.localUserRepository.save(localUser);
    }
  }

  /**
   * Create an admin user record
   * 
   * @param userId - User ID to create admin user for
   */
  private async createAdminUser(userId: string) {
    const existingAdminUser = await this.adminUserRepository.findOne({ 
      where: { userId } 
    });
    
    if (!existingAdminUser) {
      const adminUser = this.adminUserRepository.create({
        userId,
        adminLevel: 'junior',
        permissions: 'user_management',
        isActive: true,
      });
      await this.adminUserRepository.save(adminUser);
    }
  }

  /**
   * Create a super admin user record
   * 
   * @param userId - User ID to create super admin user for
   */
  private async createSuperAdminUser(userId: string) {
    const existingSuperAdminUser = await this.superAdminUserRepository.findOne({ 
      where: { userId } 
    });
    
    if (!existingSuperAdminUser) {
      const superAdminUser = this.superAdminUserRepository.create({
        userId,
        accessLevel: 'full_access',
        systemPermissions: 'all_permissions',
        isActive: true,
      });
      await this.superAdminUserRepository.save(superAdminUser);
    }
  }
} 