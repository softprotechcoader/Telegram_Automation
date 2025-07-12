import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';

/**
 * Roles Guard for Role-Based Access Control (RBAC)
 * Checks if the authenticated user has the required roles to access a route
 * Supports multi-role system where users can have multiple roles
 * Uses metadata from the @Roles() decorator to determine required permissions
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the current user can access the requested route
   * 
   * @param context - Execution context containing request information
   * @returns true if user has required roles, false otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    // Get required roles from route metadata (set by @Roles() decorator)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), // Check method-level roles first
      context.getClass(),    // Then check class-level roles
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the authenticated user from the request
    const { user } = context.switchToHttp().getRequest();
    
    // Check if user has any of the required roles
    // User can have multiple roles, so check if any match
    return requiredRoles.some((requiredRole) => 
      user.roles && user.roles.includes(requiredRole)
    );
  }
} 