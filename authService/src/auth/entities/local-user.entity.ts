import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

/**
 * Local User entity
 * Represents a local user with basic access permissions
 * Maps to the 'local_users' table in the database
 */
@Entity('local_users')
export class LocalUser {
  @ApiProperty({
    description: 'Unique local user identifier',
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
    description: 'Local user specific settings',
    example: 'local_settings',
    type: String,
    nullable: true
  })
  @Column({ nullable: true })
  localSettings: string;

  @ApiProperty({
    description: 'Local user permissions',
    example: 'basic_access',
    type: String,
    default: 'basic_access'
  })
  @Column({ default: 'basic_access' })
  permissions: string;

  @ApiProperty({
    description: 'Whether the local user account is active',
    example: true,
    default: true
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Local user creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    type: Date
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Local user last update timestamp',
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