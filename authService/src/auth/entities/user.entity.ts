import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * User roles enumeration
 * Defines the different access levels in the system
 */
export enum UserRole {
  LOCAL = 'local',        // Basic user with limited access
  ADMIN = 'admin',        // Administrator with user management access
  SUPER_ADMIN = 'super_admin', // Super administrator with full system access
}

/**
 * User entity for database operations
 * Represents a user in the system with authentication data
 * Maps to the 'users' table in the database
 * Roles are managed through separate tables for flexibility
 */
@Entity('users')
export class User {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  @PrimaryGeneratedColumn('uuid') // Auto-generated UUID primary key
  id: string;

  @ApiProperty({
    description: 'User email address (unique)',
    example: 'user@example.com',
    type: String
  })
  @Column({ unique: true }) // Ensures email uniqueness across all users
  email: string;

  @ApiProperty({
    description: 'Hashed user password',
    example: 'hashedPassword123',
    type: String
  })
  @Column()
  @Exclude() // Excludes password from JSON responses for security
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    type: String
  })
  @Column()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    type: String
  })
  @Column()
  lastName: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
    default: true
  })
  @Column({ default: true }) // Default to active account
  isActive: boolean;

  @ApiProperty({
    description: 'Last login timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: Date,
    nullable: true
  })
  @Column({ nullable: true }) // Can be null for users who never logged in
  lastLogin: Date;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: Date
  })
  @CreateDateColumn() // Automatically set when entity is created
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: Date
  })
  @UpdateDateColumn() // Automatically updated when entity is modified
  updatedAt: Date;

  // Note: Role checking methods will be updated to work with separate role tables
  // These methods will be implemented in the service layer
}
