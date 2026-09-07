import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, asc, inArray } from 'drizzle-orm';
import { DATABASE_TOKEN } from '../db/database.module';
import { type Database } from '../config/database';
import { experiences, achievements } from '../db/schema';
import type { CreateExperienceDto } from './dto/create-experience.dto';
import type { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async findAll() {
    const expList = await this.db
      .select()
      .from(experiences)
      .orderBy(asc(experiences.order), asc(experiences.id));

    if (expList.length === 0) {
      return [];
    }

    const expIds = expList.map((e) => e.id);
    const achList = await this.db
      .select()
      .from(achievements)
      .where(inArray(achievements.experienceId, expIds))
      .orderBy(asc(achievements.order), asc(achievements.id));

    const achMap = new Map<number, string[]>();
    for (const ach of achList) {
      const list = achMap.get(ach.experienceId) || [];
      list.push(ach.content);
      achMap.set(ach.experienceId, list);
    }

    return expList.map((exp) => ({
      ...exp,
      achievements: achMap.get(exp.id) || [],
    }));
  }

  async findOne(id: number) {
    const [exp] = await this.db
      .select()
      .from(experiences)
      .where(eq(experiences.id, id))
      .limit(1);

    if (!exp) {
      throw new NotFoundException('Experience not found');
    }

    const achList = await this.db
      .select()
      .from(achievements)
      .where(eq(achievements.experienceId, id))
      .orderBy(asc(achievements.order));

    return {
      ...exp,
      achievements: achList.map((a) => a.content),
    };
  }

  async create(dto: CreateExperienceDto) {
    const [exp] = await this.db
      .insert(experiences)
      .values({
        company: dto.company,
        position: dto.position,
        location: dto.location ?? null,
        startDate: dto.startDate,
        endDate: dto.endDate ?? null,
        description: dto.description ?? null,
        order: dto.order ?? 0,
      })
      .returning();

    if (dto.achievements && dto.achievements.length > 0) {
      for (let i = 0; i < dto.achievements.length; i++) {
        const content = dto.achievements[i].trim();
        if (content) {
          await this.db.insert(achievements).values({
            experienceId: exp.id,
            content,
            order: i,
          });
        }
      }
    }

    return this.findOne(exp.id);
  }

  async update(id: number, dto: UpdateExperienceDto) {
    const updateData: Record<string, unknown> = {};
    if (dto.company !== undefined) updateData.company = dto.company;
    if (dto.position !== undefined) updateData.position = dto.position;
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.startDate !== undefined) updateData.startDate = dto.startDate;
    if (dto.endDate !== undefined) updateData.endDate = dto.endDate;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.order !== undefined) updateData.order = dto.order;

    if (Object.keys(updateData).length > 0) {
      const [exp] = await this.db
        .update(experiences)
        .set(updateData)
        .where(eq(experiences.id, id))
        .returning();

      if (!exp) {
        throw new NotFoundException('Experience not found');
      }
    }

    if (dto.achievements !== undefined) {
      // Replace achievements
      await this.db.delete(achievements).where(eq(achievements.experienceId, id));
      for (let i = 0; i < dto.achievements.length; i++) {
        const content = dto.achievements[i].trim();
        if (content) {
          await this.db.insert(achievements).values({
            experienceId: id,
            content,
            order: i,
          });
        }
      }
    }

    return this.findOne(id);
  }

  async delete(id: number) {
    const [exp] = await this.db
      .delete(experiences)
      .where(eq(experiences.id, id))
      .returning();

    if (!exp) {
      throw new NotFoundException('Experience not found');
    }

    return { message: 'Experience deleted successfully' };
  }

  async reorder(items: { id: number; order: number }[]) {
    for (const item of items) {
      await this.db
        .update(experiences)
        .set({ order: item.order })
        .where(eq(experiences.id, item.id));
    }
    return { message: 'Experiences reordered successfully' };
  }
}
