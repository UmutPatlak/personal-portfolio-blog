import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { CreateLanguageDto } from './dto/create-language.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async findAll() {
    return this.educationService.findAll();
  }

  // Education endpoints
  @UseGuards(JwtAuthGuard)
  @Post()
  async createEducation(@Body() dto: CreateEducationDto) {
    return this.educationService.createEducation(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateEducation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateEducationDto>,
  ) {
    return this.educationService.updateEducation(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteEducation(@Param('id', ParseIntPipe) id: number) {
    return this.educationService.deleteEducation(id);
  }

  // Language endpoints
  @UseGuards(JwtAuthGuard)
  @Post('languages')
  async createLanguage(@Body() dto: CreateLanguageDto) {
    return this.educationService.createLanguage(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('languages/:id')
  async updateLanguage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateLanguageDto>,
  ) {
    return this.educationService.updateLanguage(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('languages/:id')
  async deleteLanguage(@Param('id', ParseIntPipe) id: number) {
    return this.educationService.deleteLanguage(id);
  }
}
