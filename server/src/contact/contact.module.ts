import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { DATABASE_TOKEN } from '../app.module';

@Module({
  controllers: [ContactController],
  providers: [
    ContactService,
    {
      provide: DATABASE_TOKEN,
      useExisting: DATABASE_TOKEN,
    },
  ],
  exports: [ContactService],
})
export class ContactModule {}
