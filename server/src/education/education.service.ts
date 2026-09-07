import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, asc } from 'drizzle-orm';
import { DATABASE_TOKEN } from '../db/database.module';
import { type Database } from '../config/database';
import { education, languages } from '../db/schema';
import type { CreateEducationDto } from './dto/create-education.dto';
import type { CreateLanguageDto } from './dto/create-language.dto';

@Injectable()
export class EducationService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async findAll() {
    const [eduList, langList] = await Promise.all([
      this.db
        .select()
        .from(education)
        .orderBy(asc(education.order), asc(education.id)),
      this.db
        .select()
        .from(languages)
        .orderBy(asc(languages.order), asc(languages.id)),
    ]);

    return {
      education: eduList,
      languages: langList,
    };
  }

  // Education CRUD
  async createEducation(dto: CreateEducationDto) {
    const [item] = await this.db
      .insert(education)
      .values({
        school: dto.school,
        department: dto.department,
        degree: dto.degree,
        startDate: dto.startDate ?? null,
        endDate: dto.endDate ?? null,
        order: dto.order ?? 0,
      })
      .returning();

    return item;
  }

  async updateEducation(id: number, dto: Partial<CreateEducationDto>) {
    const [item] = await this.db
      .update(education)
      .set(dto)
      .where(eq(education.id, id))
      .returning();

    if (!item) {
      throw new NotFoundException('Education item not found');
    }

    return item;
  }

  async deleteEducation(id: number) {
    const [item] = await this.db
      .delete(education)
      .where(eq(education.id, id))
      .returning();

    if (!item) {
      throw new NotFoundException('Education item not found');
    }

    return { message: 'Education item deleted successfully' };
  }

  // Language CRUD
  async createLanguage(dto: CreateLanguageDto) {
    const [item] = await this.db
      .insert(languages)
      .values({
        name: dto.name,
        level: dto.level,
        order: dto.order ?? 0,
      })
      .returning();

    return item;
  }

  async updateLanguage(id: number, dto: Partial<CreateLanguageDto>) {
    const [item] = await this.db
      .update(languages)
      .set(dto)
      .where(eq(languages.id, id))
      .returning();

    if (!item) {
      throw new NotFoundException('Language item not found');
    }

    return item;
  }

  async deleteLanguage(id: number) {
    const [item] = await this.db
      .delete(languages)
      .where(eq(languages.id, id))
      .returning();

    if (!item) {
      throw new NotFoundException('Language item not found');
    }

    return { message: 'Language item deleted successfully' };
  }
}
