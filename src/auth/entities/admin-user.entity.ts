import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

/**
 * Admin User entity
 * Represents an admin user with administrative access permissions
 * Maps to the 'admin_users' table in the database
 */
@Entity('admin_users')
export class AdminUser {
  @ApiProperty({
    description: 'Unique admin user identifier',
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
    description: 'Admin level (junior, senior, lead)',
    example: 'senior',
    type: String,
    default: 'junior'
  })
  @Column({ default: 'junior' })
  adminLevel: string;

  @ApiProperty({
    description: 'Admin department or area of responsibility',
    example: 'user_management',
    type: String,
    nullable: true
  })
  @Column({ nullable: true })
  department: string;

  @ApiProperty({
    description: 'Admin permissions (comma-separated)',
    example: 'user_management,content_moderation',
    type: String,
    default: 'user_management'
  })
  @Column({ default: 'user_management' })
  permissions: string;

  @ApiProperty({
    description: 'Whether the admin user account is active',
    example: true,
    default: true
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Admin user creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: Date
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Admin user last update timestamp',
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