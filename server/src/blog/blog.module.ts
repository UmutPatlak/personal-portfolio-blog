import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { DATABASE_TOKEN } from '../app.module';

@Module({
  controllers: [BlogController],
  providers: [
    BlogService,
    {
      provide: DATABASE_TOKEN,
      useExisting: DATABASE_TOKEN,
    },
  ],
  exports: [BlogService],
})
export class BlogModule { }
