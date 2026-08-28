import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { DATABASE_TOKEN } from '../app.module';

@Module({
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    {
      provide: DATABASE_TOKEN,
      useExisting: DATABASE_TOKEN,
    },
  ],
  exports: [ProjectsService],
})
export class ProjectsModule { }
