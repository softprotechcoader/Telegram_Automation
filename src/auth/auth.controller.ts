import { Controller, Post, Body, Get, Put, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdateUserDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

/**
 * Authentication controller
 * Handles user registration, login, profile management, and user administration
 * Supports multi-role system with separate role tables
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * Creates a new user account with hashed password and optional role assignments
   * 
   * @param registerDto - User registration data (email, password, firstName, lastName, optional roles)
   * @returns Created user object (without password)
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        email: { type: 'string', example: 'user@example.com' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        roles: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['local', 'admin'] 
        },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Login user
   * Authenticates user credentials and returns JWT token with user roles
   * 
   * @param loginDto - User login credentials (email, password)
   * @returns JWT access token and user information with roles
   */
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            email: { type: 'string', example: 'user@example.com' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            roles: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['local', 'admin'] 
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Update user information (All authenticated users)
   * Allows any authenticated user to update their own information
   * Useful for password recovery and profile updates
   * 
   * @param id - User ID to update
   * @param updateUserDto - User data to update
   * @param req - Request object containing authenticated user
   * @returns Updated user object (without password)
   */
  @UseGuards(JwtAuthGuard)
  @Put('users/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user (All authenticated users)' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully updated',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        email: { type: 'string', example: 'user@example.com' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        roles: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['local', 'admin'] 
        },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only update own profile' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    // Check if user is updating their own profile or has admin/super_admin role
    const currentUser = req.user;
    const isOwnProfile = currentUser.id === id;
    const isAdmin = currentUser.roles && currentUser.roles.includes('admin');
    const isSuperAdmin = currentUser.roles && currentUser.roles.includes('super_admin');

    // Allow if user is updating their own profile or has admin/super_admin role
    if (!isOwnProfile && !isAdmin && !isSuperAdmin) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.authService.updateUser(id, updateUserDto);
  }

  /**
   * Get current user profile
   * Returns the profile of the authenticated user with roles
   * 
   * @param req - Request object containing authenticated user
   * @returns Current user's profile information with roles
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        email: { type: 'string', example: 'user@example.com' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        roles: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['local', 'admin'] 
        },
        isActive: { type: 'boolean', example: true },
        lastLogin: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
        createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    return this.authService.findById(req.user.id);
  }

  /**
   * Get all users (Admin and Super Admin only)
   * Returns a list of users based on the authenticated user's role:
   * - Admin: Can see local and admin users (but not super_admin users)
   * - Super Admin: Can see all users (local, admin, and super_admin)
   * 
   * @param req - Request object containing authenticated user
   * @returns Array of user objects (without passwords) with roles
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('users')
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin and Super Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of users retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          email: { type: 'string', example: 'user@example.com' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          roles: { 
            type: 'array', 
            items: { type: 'string' },
            example: ['local', 'admin'] 
          },
          isActive: { type: 'boolean', example: true },
          lastLogin: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
          createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getAllUsers(@Request() req) {
    const currentUser = req.user;
    const isSuperAdmin = currentUser.roles && currentUser.roles.includes('super_admin');
    
    // If super admin, return all users
    if (isSuperAdmin) {
      return this.authService.findAll();
    }
    
    // If admin, return only local and admin users (exclude super_admin users)
    return this.authService.findUsersByRoles(['local', 'admin']);
  }
} 