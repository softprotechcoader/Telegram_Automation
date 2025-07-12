import {
  Controller,
  All,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { GatewayService } from './gateway.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';

@ApiTags('API Gateway')
@Controller('gateway')
@UseInterceptors(LoggingInterceptor)
export class GatewayController {
  constructor(private gatewayService: GatewayService) {}

  @All('auth/*')
  @ApiOperation({ summary: 'Route to Authentication Service' })
  async routeToAuth(@Req() req: Request, @Res() res: Response) {
    try {
      const path = req.url.replace('/gateway/auth', '');
      const result = await this.gatewayService.routeRequest(
        'auth',
        req.method,
        path,
        req.body,
        req.headers,
      );

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  @All('users/*')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Route to User Management Service' })
  async routeToUser(@Req() req: Request, @Res() res: Response) {
    try {
      const path = req.url.replace('/gateway/users', '');
      const result = await this.gatewayService.routeRequest(
        'user',
        req.method,
        path,
        req.body,
        req.headers,
      );

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  @All('telegram/*')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Route to Telegram Bot Service' })
  async routeToTelegram(@Req() req: Request, @Res() res: Response) {
    try {
      const path = req.url.replace('/gateway/telegram', '');
      const result = await this.gatewayService.routeRequest(
        'telegram',
        req.method,
        path,
        req.body,
        req.headers,
      );

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
