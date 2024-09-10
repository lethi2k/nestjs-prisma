import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class ServiceHealthIndicator extends HealthIndicator {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Check if Prisma can perform a simple query
      await this.prismaService.$queryRaw`SELECT 1`;

      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(`${key} failed`, this.getStatus(key, false, {
        message: 'Database connection failed',
        error: error.message,
      }));
    }
  }
}
