import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDatabase, type Database } from '../config/database';

export const DATABASE_TOKEN = 'DATABASE';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_TOKEN,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Database => {
        const directUrl = config.get<string>('DATABASE_URL');
        const isSsl = config.get<string>('DATABASE_SSL') === 'true';
        if (directUrl) {
          return createDatabase(directUrl, isSsl);
        }
        const host = config.get<string>('DATABASE_HOST', 'localhost');
        const port = config.get<number>('DATABASE_PORT', 5432);
        const user = config.get<string>('DATABASE_USER', 'postgres');
        const password = config.get<string>('DATABASE_PASSWORD', '');
        const database = config.get<string>('DATABASE_NAME', 'umut_portfolio');
        const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
        return createDatabase(connectionString, isSsl);
      },
    },
  ],
  exports: [DATABASE_TOKEN],
})
export class DatabaseModule { }
