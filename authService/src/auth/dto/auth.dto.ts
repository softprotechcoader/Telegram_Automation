import { IsEmail, IsString, MinLength, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for user registration
 * Defines the structure and validation rules for user registration requests
 * Supports multiple role assignments for the new multi-role system
 * 
 * @example
 * {
 *   "email": "user@example.com",
 *   "password": "securePassword123",
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "roles": ["local", "admin"]
 * }
 */
export class RegisterDto {
  @ApiProperty({
    description: 'User email address (must be unique)',
    example: 'user@example.com',
    type: String,
    format: 'email'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' }) // Validates email format
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters for security)',
    example: 'securePassword123',
    minLength: 8,
    type: String
  })
  @IsString({ message: 'Password must be a string' }) // Must be a string
  @MinLength(8, { message: 'Password must be at least 8 characters long' }) // Minimum 8 characters for security
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    type: String
  })
  @IsString({ message: 'First name must be a string' }) // Must be a string
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    type: String
  })
  @IsString({ message: 'Last name must be a string' }) // Must be a string
  lastName: string;

  @ApiPropertyOptional({
    description: 'Roles to assign to the user (optional, defaults to local if not specified)',
    example: ['local', 'admin'],
    type: [String],
    isArray: true,
    enum: ['local', 'admin', 'super_admin']
  })
  @IsArray({ message: 'Roles must be an array' }) // Must be an array
  @IsOptional() // Optional field - if not provided, user gets local role by default
  roles?: string[];
}

/**
 * Data Transfer Object for user login
 * Defines the structure and validation rules for login requests
 * Used for authenticating users and generating JWT tokens
 * 
 * @example
 * {
 *   "email": "user@example.com",
 *   "password": "securePassword123"
 * }
 */
export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
    format: 'email'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' }) // Validates email format
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
    type: String
  })
  @IsString({ message: 'Password must be a string' }) // Must be a string
  password: string;
}

/**
 * Data Transfer Object for user updates
 * Defines the structure and validation rules for user update requests
 * All fields are optional to allow partial updates
 * Used for password recovery and profile updates
 * 
 * @example
 * {
 *   "firstName": "Updated",
 *   "lastName": "Name",
 *   "password": "newSecurePassword123"
 * }
 */
export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
    type: String
  })
  @IsString({ message: 'First name must be a string' }) // Must be a string
  @IsOptional() // Optional field for partial updates
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
    type: String
  })
  @IsString({ message: 'Last name must be a string' }) // Must be a string
  @IsOptional() // Optional field for partial updates
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User password (minimum 8 characters for security)',
    example: 'newSecurePassword123',
    minLength: 8,
    type: String
  })
  @IsString({ message: 'Password must be a string' }) // Must be a string
  @MinLength(8, { message: 'Password must be at least 8 characters long' }) // Minimum 8 characters for security
  @IsOptional() // Optional field for partial updates
  password?: string;
}

/**
 * Data Transfer Object for role assignment
 * Defines the structure for assigning roles to users
 * Used in role management operations
 * 
 * @example
 * {
 *   "role": "admin",
 *   "roleData": { "adminLevel": "senior", "department": "user_management" }
 * }
 */
export class AssignRoleDto {
  @ApiProperty({
    description: 'Role type to assign',
    example: 'admin',
    type: String,
    enum: ['local', 'admin', 'super_admin']
  })
  @IsString({ message: 'Role must be a string' }) // Must be a string
  role: string;

  @ApiPropertyOptional({
    description: 'Role-specific data (optional)',
    example: { permissions: 'basic_access' },
    type: Object
  })
  @IsOptional() // Optional field for role-specific configuration
  roleData?: any;
}

/**
 * Data Transfer Object for local user creation
 * Defines the structure for creating local user accounts
 * Contains local user specific settings and permissions
 * 
 * @example
 * {
 *   "localSettings": '{"theme": "dark", "language": "en"}',
 *   "permissions": "basic_access"
 * }
 */
export class CreateLocalUserDto {
  @ApiPropertyOptional({
    description: 'Local user specific settings (JSON string)',
    example: '{"theme": "dark", "language": "en"}',
    type: String
  })
  @IsString({ message: 'Local settings must be a string' }) // Must be a string
  @IsOptional() // Optional field
  localSettings?: string;

  @ApiPropertyOptional({
    description: 'Local user permissions',
    example: 'basic_access',
    type: String,
    default: 'basic_access'
  })
  @IsString({ message: 'Permissions must be a string' }) // Must be a string
  @IsOptional() // Optional field
  permissions?: string;
}

/**
 * Data Transfer Object for admin user creation
 * Defines the structure for creating admin user accounts
 * Contains admin-specific settings, levels, and permissions
 * 
 * @example
 * {
 *   "adminLevel": "senior",
 *   "department": "user_management",
 *   "permissions": "user_management,content_moderation"
 * }
 */
export class CreateAdminUserDto {
  @ApiPropertyOptional({
    description: 'Admin level (junior, senior, lead)',
    example: 'senior',
    type: String,
    default: 'junior',
    enum: ['junior', 'senior', 'lead']
  })
  @IsString({ message: 'Admin level must be a string' }) // Must be a string
  @IsOptional() // Optional field
  adminLevel?: string;

  @ApiPropertyOptional({
    description: 'Admin department or area of responsibility',
    example: 'user_management',
    type: String
  })
  @IsString({ message: 'Department must be a string' }) // Must be a string
  @IsOptional() // Optional field
  department?: string;

  @ApiPropertyOptional({
    description: 'Admin permissions (comma-separated)',
    example: 'user_management,content_moderation',
    type: String,
    default: 'user_management'
  })
  @IsString({ message: 'Permissions must be a string' }) // Must be a string
  @IsOptional() // Optional field
  permissions?: string;
}

/**
 * Data Transfer Object for super admin user creation
 * Defines the structure for creating super admin user accounts
 * Contains super admin specific settings and system-wide permissions
 * 
 * @example
 * {
 *   "accessLevel": "full_access",
 *   "systemPermissions": "all_permissions",
 *   "emergencyContact": "emergency@company.com"
 * }
 */
export class CreateSuperAdminUserDto {
  @ApiPropertyOptional({
    description: 'Super admin access level',
    example: 'full_access',
    type: String,
    default: 'full_access',
    enum: ['full_access']
  })
  @IsString({ message: 'Access level must be a string' }) // Must be a string
  @IsOptional() // Optional field
  accessLevel?: string;

  @ApiPropertyOptional({
    description: 'System-wide permissions',
    example: 'all_permissions',
    type: String,
    default: 'all_permissions'
  })
  @IsString({ message: 'System permissions must be a string' }) // Must be a string
  @IsOptional() // Optional field
  systemPermissions?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact information',
    example: 'emergency@company.com',
    type: String
  })
  @IsString({ message: 'Emergency contact must be a string' }) // Must be a string
  @IsOptional() // Optional field
  emergencyContact?: string;
} 