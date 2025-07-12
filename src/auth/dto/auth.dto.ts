import { IsEmail, IsString, MinLength, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for user registration
 * Defines the structure and validation rules for user registration requests
 * Supports multiple role assignments
 */
export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String
  })
  @IsEmail() // Validates email format
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'password123',
    minLength: 8,
    type: String
  })
  @IsString() // Must be a string
  @MinLength(8) // Minimum 8 characters for security
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    type: String
  })
  @IsString() // Must be a string
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    type: String
  })
  @IsString() // Must be a string
  lastName: string;

  @ApiPropertyOptional({
    description: 'Roles to assign to the user (optional)',
    example: ['local', 'admin'],
    type: [String],
    isArray: true
  })
  @IsArray() // Must be an array
  @IsOptional() // Optional field
  roles?: string[];
}

/**
 * Data Transfer Object for user login
 * Defines the structure and validation rules for login requests
 */
export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String
  })
  @IsEmail() // Validates email format
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    type: String
  })
  @IsString() // Must be a string
  password: string;
}

/**
 * Data Transfer Object for user updates
 * Defines the structure and validation rules for user update requests
 * All fields are optional to allow partial updates
 */
export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
    type: String
  })
  @IsString() // Must be a string
  @IsOptional() // Optional field
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
    type: String
  })
  @IsString() // Must be a string
  @IsOptional() // Optional field
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User password (minimum 8 characters)',
    example: 'newpassword123',
    minLength: 8,
    type: String
  })
  @IsString() // Must be a string
  @MinLength(8) // Minimum 8 characters for security
  @IsOptional() // Optional field
  password?: string;
}

/**
 * Data Transfer Object for role assignment
 * Defines the structure for assigning roles to users
 */
export class AssignRoleDto {
  @ApiProperty({
    description: 'Role type to assign',
    example: 'local',
    type: String
  })
  @IsString() // Must be a string
  role: string;

  @ApiPropertyOptional({
    description: 'Role-specific data (optional)',
    example: { permissions: 'basic_access' },
    type: Object
  })
  @IsOptional() // Optional field
  roleData?: any;
}

/**
 * Data Transfer Object for local user creation
 * Defines the structure for creating local user accounts
 */
export class CreateLocalUserDto {
  @ApiPropertyOptional({
    description: 'Local user specific settings',
    example: 'local_settings',
    type: String
  })
  @IsString() // Must be a string
  @IsOptional() // Optional field
  localSettings?: string;

  @ApiPropertyOptional({
    description: 'Local user permissions',
    example: 'basic_access',
    type: String,
    default: 'basic_access'
  })
  @IsString() // Must be a string
  @IsOptional() // Optional field
  permissions?: string;
}

/**
 * Data Transfer Object for admin user creation
 * Defines the structure for creating admin user accounts
 */
export class CreateAdminUserDto {
  @ApiPropertyOptional({
    description: 'Admin level (junior, senior, lead)',
    example: 'senior',
    type: String,
    default: 'junior'
  })
  @IsString() // Must be a string
  @IsOptional() // Optional field
  adminLevel?: string;

  @ApiPropertyOptional({
    description: 'Admin department or area of responsibility',
    example: 'user_management',
    type: String
  })
  @IsString() // Must be a string
  @IsOptional() // Optional field
  department?: string;

  @ApiPropertyOptional({
    description: 'Admin permissions (comma-separated)',
    example: 'user_management,content_moderation',
    type: String,
    default: 'user_management'
  })
  @IsString() // Must be a string
  @IsOptional() // Optional field
  permissions?: string;
}

/**
 * Data Transfer Object for super admin user creation
 * Defines the structure for creating super admin user accounts
 */
export class CreateSuperAdminUserDto {
  @ApiPropertyOptional({
    description: 'Super admin access level',
    example: 'full_access',
    type: String,
    default: 'full_access'
  })
  @IsString() // Must be a string
  @IsOptional() // Optional field
  accessLevel?: string;

  @ApiPropertyOptional({
    description: 'System-wide permissions',
    example: 'all_permissions',
    type: String,
    default: 'all_permissions'
  })
  @IsString() // Must be a string
  @IsOptional() // Optional field
  systemPermissions?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact information',
    example: 'emergency@company.com',
    type: String
  })
  @IsString() // Must be a string
  @IsOptional() // Optional field
  emergencyContact?: string;
} 