import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  HealthIndicatorResult,
  HealthCheckResult,
} from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      (): Promise<HealthIndicatorResult> =>
        this.db.pingCheck('database', { timeout: 300 }),
    ]);
  }
}
