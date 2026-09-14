import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, asc, inArray } from 'drizzle-orm';
import { DATABASE_TOKEN } from '../db/database.module';
import { type Database } from '../config/database';
import { skillCategories, skills } from '../db/schema';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async findAll() {
    const categories = await this.db
      .select()
      .from(skillCategories)
      .orderBy(asc(skillCategories.order), asc(skillCategories.id));

    if (categories.length === 0) {
      return [];
    }

    const catIds = categories.map((c) => c.id);
    const skillList = await this.db
      .select()
      .from(skills)
      .where(inArray(skills.categoryId, catIds))
      .orderBy(asc(skills.order), asc(skills.id));

    const skillMap = new Map<number, typeof skillList>();
    for (const skill of skillList) {
      const list = skillMap.get(skill.categoryId) || [];
      list.push(skill);
      skillMap.set(skill.categoryId, list);
    }

    return categories.map((cat) => ({
      ...cat,
      skills: skillMap.get(cat.id) || [],
    }));
  }

  async createCategory(dto: CreateCategoryDto) {
    const [cat] = await this.db
      .insert(skillCategories)
      .values({
        name: dto.name,
        icon: dto.icon ?? null,
        order: dto.order ?? 0,
      })
      .returning();

    return { ...cat, skills: [] };
  }

  async updateCategory(id: number, dto: Partial<CreateCategoryDto>) {
    const [cat] = await this.db
      .update(skillCategories)
      .set(dto)
      .where(eq(skillCategories.id, id))
      .returning();

    if (!cat) {
      throw new NotFoundException('Category not found');
    }

    return cat;
  }

  async deleteCategory(id: number) {
    const [cat] = await this.db
      .delete(skillCategories)
      .where(eq(skillCategories.id, id))
      .returning();

    if (!cat) {
      throw new NotFoundException('Category not found');
    }

    return { message: 'Category deleted successfully' };
  }

  async addSkill(dto: CreateSkillDto) {
    const [skill] = await this.db
      .insert(skills)
      .values({
        categoryId: dto.categoryId,
        name: dto.name,
        order: dto.order ?? 0,
      })
      .returning();

    return skill;
  }

  async updateSkill(id: number, dto: Partial<CreateSkillDto>) {
    const [skill] = await this.db
      .update(skills)
      .set(dto)
      .where(eq(skills.id, id))
      .returning();

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  async deleteSkill(id: number) {
    const [skill] = await this.db
      .delete(skills)
      .where(eq(skills.id, id))
      .returning();

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return { message: 'Skill deleted successfully' };
  }

  async reorderCategories(items: { id: number; order: number }[]) {
    await Promise.all(
      items.map((item) =>
        this.db
          .update(skillCategories)
          .set({ order: item.order })
          .where(eq(skillCategories.id, item.id)),
      ),
    );
    return { message: 'Categories reordered successfully' };
  }

  async reorderSkills(items: { id: number; order: number }[]) {
    await Promise.all(
      items.map((item) =>
        this.db
          .update(skills)
          .set({ order: item.order })
          .where(eq(skills.id, item.id)),
      ),
    );
    return { message: 'Skills reordered successfully' };
  }
}
