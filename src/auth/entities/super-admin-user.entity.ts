import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

/**
 * Super Admin User entity
 * Represents a super admin user with full system access permissions
 * Maps to the 'super_admin_users' table in the database
 */
@Entity('super_admin_users')
export class SuperAdminUser {
  @ApiProperty({
    description: 'Unique super admin user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Reference to the main user account',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  @Column()
  userId: string;

  @ApiProperty({
    description: 'Super admin access level',
    example: 'full_access',
    type: String,
    default: 'full_access'
  })
  @Column({ default: 'full_access' })
  accessLevel: string;

  @ApiProperty({
    description: 'System-wide permissions',
    example: 'all_permissions',
    type: String,
    default: 'all_permissions'
  })
  @Column({ default: 'all_permissions' })
  systemPermissions: string;

  @ApiProperty({
    description: 'Emergency contact information',
    example: 'emergency@company.com',
    type: String,
    nullable: true
  })
  @Column({ nullable: true })
  emergencyContact: string;

  @ApiProperty({
    description: 'Whether the super admin user account is active',
    example: true,
    default: true
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Super admin user creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: Date
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Super admin user last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: Date
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relationship to main user
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
} 