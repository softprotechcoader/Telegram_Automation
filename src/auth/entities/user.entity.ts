// import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { Exclude } from 'class-transformer';

// export enum UserRole {
//   LOCAL = 'local',
//   ADMIN = 'admin',
//   SUPER_ADMIN = 'super_admin',
// }

// @Entity('users')
// export class User {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ unique: true })
//   email: string;

//   @Column()
//   @Exclude()
//   password: string;

//   @Column()
//   firstName: string;

//   @Column()
//   lastName: string;

//   // @Column({
//   //   type: 'enum',
//   //   enum: UserRole,
//   //   default: UserRole.LOCAL
//   // })
//   // role: UserRole;

//   @Column({
//     type: 'varchar',  // Use varchar instead of enum for MSSQL
//     length: 50,       // optional: set a max length
//     default: UserRole.LOCAL,
//   })
//   role: UserRole;
  

//   @Column({ default: true })
//   isActive: boolean;

//   @Column({ nullable: true })
//   lastLogin: Date;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;

//   // Helper methods for role-based access control
//   isLocalUser(): boolean {
//     return this.role === UserRole.LOCAL;
//   }

//   isAdmin(): boolean {
//     return this.role === UserRole.ADMIN;
//   }

//   isSuperAdmin(): boolean {
//     return this.role === UserRole.SUPER_ADMIN;
//   }
// } 

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  LOCAL = 'local',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: UserRole.LOCAL,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper methods for role-based access control
  isLocalUser(): boolean {
    return this.role === UserRole.LOCAL;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isSuperAdmin(): boolean {
    return this.role === UserRole.SUPER_ADMIN;
  }
}
