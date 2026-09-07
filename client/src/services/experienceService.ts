import api from './api';
import type { Experience } from '@/types/experience';

export const experienceService = {
  async getExperiences(): Promise<Experience[]> {
    const { data } = await api.get<Experience[]>('/experiences');
    return data;
  },

  async createExperience(experience: Partial<Experience>): Promise<Experience> {
    const { data } = await api.post<Experience>('/experiences', experience);
    return data;
  },

  async updateExperience(id: number, experience: Partial<Experience>): Promise<Experience> {
    const { data } = await api.patch<Experience>(`/experiences/${id}`, experience);
    return data;
  },

  async deleteExperience(id: number): Promise<void> {
    await api.delete(`/experiences/${id}`);
  },

  async reorderExperiences(items: { id: number; order: number }[]): Promise<void> {
    await api.patch('/experiences/reorder', { items });
  },
};
