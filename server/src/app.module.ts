import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { DatabaseModule } from './db/database.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ProjectsModule } from './projects/projects.module';
import { ContactModule } from './contact/contact.module';
import { UploadModule } from './upload/upload.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { SkillsModule } from './skills/skills.module';
import { EducationModule } from './education/education.module';
import { PersonalInfoModule } from './personal-info/personal-info.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
    DatabaseModule,
    AuthModule,
    BlogModule,
    ProjectsModule,
    ContactModule,
    UploadModule,
    ExperiencesModule,
    SkillsModule,
    EducationModule,
    PersonalInfoModule,
    HealthModule,
    SitemapModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
