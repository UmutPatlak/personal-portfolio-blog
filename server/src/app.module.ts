import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ProjectsModule } from './projects/projects.module';
import { ContactModule } from './contact/contact.module';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
    DatabaseModule,
    AuthModule,
    BlogModule,
    ProjectsModule,
    ContactModule,
  ],
  providers: [],
})
export class AppModule { }
