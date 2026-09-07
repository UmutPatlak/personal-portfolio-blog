import { Module } from '@nestjs/common';
import { PersonalInfoController } from './personal-info.controller';
import { PersonalInfoService } from './personal-info.service';

@Module({
  controllers: [PersonalInfoController],
  providers: [PersonalInfoService],
  exports: [PersonalInfoService],
})
export class PersonalInfoModule {}
