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
import { SkillsService } from './skills.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async findAll() {
    return this.skillsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('categories')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.skillsService.createCategory(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('categories/reorder')
  async reorderCategories(@Body() body: { items: { id: number; order: number }[] }) {
    return this.skillsService.reorderCategories(body.items);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('categories/:id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateCategoryDto>,
  ) {
    return this.skillsService.updateCategory(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('categories/:id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.deleteCategory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addSkill(@Body() dto: CreateSkillDto) {
    return this.skillsService.addSkill(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  async reorderSkills(@Body() body: { items: { id: number; order: number }[] }) {
    return this.skillsService.reorderSkills(body.items);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateSkill(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateSkillDto>,
  ) {
    return this.skillsService.updateSkill(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteSkill(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.deleteSkill(id);
  }
}
