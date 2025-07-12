import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for storing role requirements
 * Used by RolesGuard to check user permissions
 */
export const ROLES_KEY = 'roles';

/**
 * Roles decorator for role-based access control
 * Marks routes with required user roles for authorization
 * Supports multi-role system where users can have multiple roles
 * 
 * @param roles - Array of role strings that can access the route
 * @returns Decorator function that sets metadata
 * 
 * @example
 * @Roles('admin', 'super_admin')
 * @Get('users')
 * getAllUsers() { ... }
 * 
 * @example
 * @Roles('local')
 * @Get('profile')
 * getProfile() { ... }
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); 