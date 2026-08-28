import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ProjectsModule } from './projects/projects.module';
import { ContactModule } from './contact/contact.module';
import { createDatabase, type Database } from './config/database';

export const DATABASE_TOKEN = 'DATABASE';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
    AuthModule,
    BlogModule,
    ProjectsModule,
    ContactModule,
  ],
  providers: [
    {
      provide: DATABASE_TOKEN,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Database => {
        const host = config.get<string>('DATABASE_HOST', 'localhost');
        const port = config.get<number>('DATABASE_PORT', 5432);
        const user = config.get<string>('DATABASE_USER', 'postgres');
        const password = config.get<string>('DATABASE_PASSWORD', '');
        const database = config.get<string>('DATABASE_NAME', 'umut_portfolio');
        const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
        return createDatabase(connectionString);
      },
    },
  ],
  exports: [DATABASE_TOKEN],
})
export class AppModule { }
