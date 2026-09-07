import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  Res,
  Header,
} from '@nestjs/common';
import type { Response } from 'express';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
  ) {
    return this.blogService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      tag,
      search,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  async adminFindAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.blogService.adminFindAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      status,
      search,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findById(id);
  }

  @Get('og/general')
  @Header('Content-Type', 'image/svg+xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=86400, s-maxage=86400')
  getGeneralOgImage(@Res() res: Response) {
    const svg = this.blogService.generateGeneralBlogOgSvg();
    return res.send(svg);
  }

  @Get(':slug/og-image')
  @Header('Content-Type', 'image/svg+xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=86400, s-maxage=86400')
  async getPostOgImage(@Param('slug') slug: string, @Res() res: Response) {
    const svg = await this.blogService.generateOgSvg(slug);
    return res.send(svg);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreatePostDto,
    @Request() req: { user: { userId: number } },
  ) {
    return this.blogService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.toggleStatus(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
  ) {
    return this.blogService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.delete(id);
  }
}
