import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 * Protects routes by validating JWT tokens in the Authorization header
 * Uses the 'jwt' strategy defined in JwtStrategy
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {} 