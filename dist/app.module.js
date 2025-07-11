"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const user_entity_1 = require("./auth/entities/user.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    console.log('DB_TYPE:', config.get('DB_TYPE'));
                    console.log('DB_AUTH_TYPE:', config.get('DB_AUTH_TYPE'));
                    console.log('DB_USERNAME:', config.get('DB_USERNAME'));
                    console.log('DB_PASSWORD:', config.get('DB_PASSWORD') ? '****' : 'not set');
                    const dbType = config.get('DB_TYPE', 'mssql');
                    const commonOptions = {
                        entities: [user_entity_1.User],
                        synchronize: config.get('NODE_ENV') !== 'production',
                    };
                    if (dbType === 'mssql' && config.get('DB_AUTH_TYPE') === 'sql') {
                        return {
                            type: 'mssql',
                            host: config.get('DB_HOST', 'localhost'),
                            port: parseInt(config.get('DB_PORT', '1433')),
                            username: config.get('DB_USERNAME', 'sa'),
                            password: config.get('DB_PASSWORD'),
                            database: config.get('DB_NAME', 'telegram_automation'),
                            options: {
                                encrypt: false,
                                trustServerCertificate: true,
                                instanceName: config.get('DB_INSTANCE', 'SQLEXPRESS'),
                            },
                            ...commonOptions,
                        };
                    }
                    throw new Error(`Unsupported DB_TYPE or DB_AUTH_TYPE: ${dbType} / ${config.get('DB_AUTH_TYPE')}`);
                },
            }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: '1d' },
            }),
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map