import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, asc } from 'drizzle-orm';
import { DATABASE_TOKEN } from '../db/database.module';
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
      .orderBy(asc(projects.order), asc(projects.id));
  }

  async findOne(id: number) {
    const [project] = await this.db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async create(dto: CreateProjectDto) {
    const [project] = await this.db
      .insert(projects)
      .values({
        title: dto.title,
        type: dto.type ?? null,
        description: dto.description,
        technologies: dto.technologies || [],
        githubUrl: dto.githubUrl ?? null,
        demoUrl: dto.demoUrl ?? null,
        imageUrl: dto.imageUrl ?? null,
        architecture: dto.architecture ?? null,
        challenges: dto.challenges ?? null,
        solutions: dto.solutions ?? null,
        featured: dto.featured ?? false,
        order: dto.order ?? 0,
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

  async reorder(items: { id: number; order: number }[]) {
    await Promise.all(
      items.map((item) =>
        this.db
          .update(projects)
          .set({ order: item.order })
          .where(eq(projects.id, item.id)),
      ),
    );
    return { message: 'Projects reordered successfully' };
  }
}
