import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, asc } from 'drizzle-orm';
import { DATABASE_TOKEN } from '../app.module';
import { type Database } from '../config/database';
import { projects } from '../db/schema';
import type { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async findAll() {
    return this.db
      .select()
      .from(projects)
      .orderBy(asc(projects.order));
  }

  async create(dto: CreateProjectDto) {
    const [project] = await this.db
      .insert(projects)
      .values({
        title: dto.title,
        description: dto.description,
        technologies: dto.technologies,
        githubUrl: dto.githubUrl ?? null,
        demoUrl: dto.demoUrl ?? null,
        imageUrl: dto.imageUrl ?? null,
        featured: dto.featured,
        order: dto.order,
      })
      .returning();

    return project;
  }

  async update(id: number, dto: Partial<CreateProjectDto>) {
    const [project] = await this.db
      .update(projects)
      .set(dto)
      .where(eq(projects.id, id))
      .returning();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async delete(id: number) {
    const [project] = await this.db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return { message: 'Project deleted successfully' };
  }
}
