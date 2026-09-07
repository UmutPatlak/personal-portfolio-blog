import api from './api';
import type { SkillCategoryWithSkills, SkillItem } from '@/types/skill';

export const skillService = {
  async getSkills(): Promise<SkillCategoryWithSkills[]> {
    const { data } = await api.get<SkillCategoryWithSkills[]>('/skills');
    return data;
  },

  async createCategory(name: string, icon?: string): Promise<SkillCategoryWithSkills> {
    const { data } = await api.post<SkillCategoryWithSkills>('/skills/categories', { name, icon });
    return data;
  },

  async updateCategory(id: number, cat: Partial<SkillCategoryWithSkills>): Promise<SkillCategoryWithSkills> {
    const { data } = await api.patch<SkillCategoryWithSkills>(`/skills/categories/${id}`, cat);
    return data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/skills/categories/${id}`);
  },

  async addSkill(categoryId: number, name: string): Promise<SkillItem> {
    const { data } = await api.post<SkillItem>('/skills', { categoryId, name });
    return data;
  },

  async updateSkill(id: number, name: string): Promise<SkillItem> {
    const { data } = await api.patch<SkillItem>(`/skills/${id}`, { name });
    return data;
  },

  async deleteSkill(id: number): Promise<void> {
    await api.delete(`/skills/${id}`);
  },

  async reorderCategories(items: { id: number; order: number }[]): Promise<void> {
    await api.patch('/skills/categories/reorder', { items });
  },

  async reorderSkills(items: { id: number; order: number }[]): Promise<void> {
    await api.patch('/skills/reorder', { items });
  },
};
