import {
  Controller,
  Get,
  Patch,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PersonalInfoService } from './personal-info.service';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('personal-info')
export class PersonalInfoController {
  constructor(private readonly personalInfoService: PersonalInfoService) {}

  @Get()
  async get() {
    return this.personalInfoService.get();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() dto: UpdatePersonalInfoDto) {
    return this.personalInfoService.update(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async putUpdate(@Body() dto: UpdatePersonalInfoDto) {
    return this.personalInfoService.update(dto);
  }
}
