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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ensures it's accessible everywhere
    }),
    

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        
          console.log('DB_TYPE:', config.get('DB_TYPE'));
          console.log('DB_AUTH_TYPE:', config.get('DB_AUTH_TYPE'));
          console.log('DB_USERNAME:', config.get('DB_USERNAME'));
          console.log('DB_PASSWORD:', config.get('DB_PASSWORD') ? '****' : 'not set');
          
        const dbType = config.get<string>('DB_TYPE', 'mssql');
        const commonOptions = {
          entities: [User],
          synchronize: config.get('NODE_ENV') !== 'production',
        };
        console.log(
          'CHECKING DB CONFIG:',
          'dbType =', dbType,
          '| authType =', config.get('DB_AUTH_TYPE')
        );
        
        if (dbType === 'mssql' && config.get('DB_AUTH_TYPE') === 'sql') {
          return {
            type: 'mssql',
            host: config.get('DB_HOST', 'localhost'),
            port: parseInt(config.get('DB_PORT', '1433')),
            // username: config.get('DB_USERNAME', 'sa'),
            // password: config.get('DB_PASSWORD'),
            username: config.get('DB_USERNAME')?.trim() || 'sa',
            password: config.get('DB_PASSWORD')?.trim(),
            database: config.get('DB_NAME', 'telegram_automation'),
            options: {
              encrypt: false,
              trustServerCertificate: true,
              instanceName: config.get('DB_INSTANCE', 'SQLEXPRESS'),
              connectionTimeout: 30000, // 30 seconds (default is 15000 ms)
              requestTimeout: 30000,    // 30 seconds (default is 15000 ms)
            },
            ...commonOptions,
          };
        }

        throw new Error(`Unsupported DB_TYPE or DB_AUTH_TYPE: ${dbType} / ${config.get('DB_AUTH_TYPE')}`);
      },
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),

    AuthModule,
  ],
})
export class AppModule {}
