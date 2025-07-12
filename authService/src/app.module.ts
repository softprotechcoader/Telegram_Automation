// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
// import { User } from './auth/entities/user.entity';

// @Module({
//   imports: [
//     // Load environment variables from .env file
//     ConfigModule.forRoot(),
//     // Dynamically configure TypeORM based on DB_TYPE
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => {
//         // Default DB_TYPE is now 'mssql' (SQL Server)
//         const dbType = config.get<string>('DB_TYPE', 'mssql');
//         const commonOptions = {
//           entities: [User],
//           synchronize: config.get('NODE_ENV') !== 'production',
//         };
//         // const dbAuthType = config.get('DB_AUTH_TYPE');
//         console.log('DB_AUTH_TYPE', config.get('DB_AUTH_TYPE'));
//         console.log('process.env.DB_AUTH_TYPE', process.env.DB_AUTH_TYPE);
//         // Postgres config
//         if (dbType === 'postgres') {
//           return {
//             type: 'postgres',
//             host: config.get('DB_HOST', 'localhost'),
//             port: parseInt(config.get('DB_PORT', '5432')),
//             username: config.get('DB_USERNAME', 'postgres'),
//             password: config.get('DB_PASSWORD', 'postgres'),
//             database: config.get('DB_NAME', 'telegram_automation'),
//             ...commonOptions,
//           };
//         }
//         // SQL Server config (supports both SQL and Windows Authentication)
//         if (dbType === 'mssql') {

//           // If DB_AUTH_TYPE is 'ntlm', use Windows Authentication
//           if (config.get('DB_AUTH_TYPE') === 'ntlm') {
           
//             return {
//               type: 'mssql',
//               host: config.get('DB_HOST', 'localhost'),
//               port: parseInt(config.get('DB_PORT', '1433')),
//               database: config.get('DB_NAME', 'telegram_automation'),
//               options: {
//                 encrypt: false, // Set to true if using Azure
//                 trustServerCertificate: true,
//                 instanceName: config.get('DB_INSTANCE', 'SQLEXPRESS'),
//                 authentication: {
//                   type: 'ntlm',
//                   options: {
//                     domain: config.get('DB_DOMAIN', ''),
//                     userName: '', // Leave blank for Windows Authentication
//                     password: '', // Leave blank for Windows Authentication
//                   },
//                 },
//               },
//               ...commonOptions,
//             };
//           } else {
//             // SQL Authentication (username/password)
//             return {
//               type: 'mssql',
//               host: config.get('DB_HOST', 'localhost'),
//               port: parseInt(config.get('DB_PORT', '1433')),
//               username: config.get('DB_USERNAME', 'sa'),
//               password: config.get('DB_PASSWORD', 'yourStrong(!)Password'),
//               database: config.get('DB_NAME', 'telegram_automation'),
//               options: {
//                 encrypt: false, // Set to true if using Azure
//                 trustServerCertificate: true,
//                 instanceName: config.get('DB_INSTANCE', 'SQLEXPRESS'),
//               },
//               ...commonOptions,
//             };
//           }
//         }
//         // MongoDB config
//         if (dbType === 'mongodb') {
//           return {
//             type: 'mongodb',
//             url: config.get('DB_URL', 'mongodb://localhost:27017/telegram_automation'),
//             useUnifiedTopology: true,
//             ...commonOptions,
//           };
//         }
//         throw new Error(`Unsupported DB_TYPE: ${dbType}`);
//       },
//     }),
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'your-secret-key',
//       signOptions: { expiresIn: '1d' },
//     }),
//     AuthModule,
//   ],
// })
// export class AppModule {} 

// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { LocalUser } from './auth/entities/local-user.entity';
import { AdminUser } from './auth/entities/admin-user.entity';
import { SuperAdminUser } from './auth/entities/super-admin-user.entity';
import { AppController } from './app.controller';

/**
 * Main application module
 * Configures all core modules, database connection, and JWT authentication
 */
@Module({
  imports: [
    // Global configuration module for environment variables
    // Makes config service available throughout the application
    ConfigModule.forRoot({
      isGlobal: true, // ensures it's accessible everywhere
    }),
    
    // Database configuration using TypeORM
    // Dynamically configures database connection based on environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        
        // Log database configuration for debugging
        console.log('DB_TYPE:', config.get('DB_TYPE'));
        console.log('DB_AUTH_TYPE:', config.get('DB_AUTH_TYPE'));
        console.log('DB_USERNAME:', config.get('DB_USERNAME'));
        console.log('DB_PASSWORD:', config.get('DB_PASSWORD') ? '****' : 'not set');
        
        // Get database type from environment variables (default: mssql)
        const dbType = config.get<string>('DB_TYPE', 'mssql');
        
        // Common TypeORM options for all database types
        const commonOptions = {
          entities: [User, LocalUser, AdminUser, SuperAdminUser], // Register all entities
          synchronize: config.get('NODE_ENV') !== 'production', // Auto-sync schema in development
        };
        
        // Log current database configuration
        console.log(
          'CHECKING DB CONFIG:',
          'dbType =', dbType,
          '| authType =', config.get('DB_AUTH_TYPE')
        );
        
        // SQL Server configuration with SQL Authentication
        if (dbType === 'mssql' && config.get('DB_AUTH_TYPE') === 'sql') {
          return {
            type: 'mssql',
            host: config.get('DB_HOST', 'localhost'),
            port: parseInt(config.get('DB_PORT', '1433')),
            // Use trimmed values to avoid whitespace issues
            username: config.get('DB_USERNAME')?.trim() || 'sa',
            password: config.get('DB_PASSWORD')?.trim(),
            database: config.get('DB_NAME', 'telegram_automation'),
            options: {
              encrypt: false, // Set to true for Azure SQL
              trustServerCertificate: true, // Trust self-signed certificates
              instanceName: config.get('DB_INSTANCE', 'SQLEXPRESS'),
              connectionTimeout: 30000, // 30 seconds connection timeout
              requestTimeout: 30000,    // 30 seconds request timeout
            },
            ...commonOptions,
          };
        }

        // Throw error for unsupported database configurations
        throw new Error(`Unsupported DB_TYPE or DB_AUTH_TYPE: ${dbType} / ${config.get('DB_AUTH_TYPE')}`);
      },
    }),

    // JWT module configuration for token-based authentication
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // JWT signing secret
      signOptions: { expiresIn: '1d' }, // Token expires in 1 day
    }),

    // Import the authentication module
    AuthModule,
  ],
  controllers: [AppController], // Register the root controller
})
export class AppModule {}
