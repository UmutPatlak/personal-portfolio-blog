import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { HealthService } from './health.service';
import { Response } from 'express';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check(@Res() res: Response) {
    const isDbConnected = await this.healthService.checkDatabase();

    if (isDbConnected) {
      return res.status(HttpStatus.OK).json({
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      });
    } else {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'error',
        database: 'disconnected',
      });
    }
  }
}
