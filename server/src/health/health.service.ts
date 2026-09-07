import { Injectable, Inject, ServiceUnavailableException } from '@nestjs/common';
import { DATABASE_TOKEN } from '../db/database.module';
import { sql } from 'drizzle-orm';

@Injectable()
export class HealthService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: any) {}

  async checkDatabase(): Promise<boolean> {
    try {
      await this.db.execute(sql`SELECT 1`);
      return true;
    } catch (error) {
      return false;
    }
  }
}
