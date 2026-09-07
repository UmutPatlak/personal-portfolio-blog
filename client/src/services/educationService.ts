import api from './api';
import type { Education, Language, EducationResponse } from '@/types/education';

export const educationService = {
  async getEducation(): Promise<EducationResponse> {
    const { data } = await api.get<EducationResponse>('/education');
    return data;
  },

  async createEducation(education: Partial<Education>): Promise<Education> {
    const { data } = await api.post<Education>('/education', education);
    return data;
  },

  async updateEducation(id: number, education: Partial<Education>): Promise<Education> {
    const { data } = await api.patch<Education>(`/education/${id}`, education);
    return data;
  },

  async deleteEducation(id: number): Promise<void> {
    await api.delete(`/education/${id}`);
  },

  async createLanguage(language: Partial<Language>): Promise<Language> {
    const { data } = await api.post<Language>('/education/languages', language);
    return data;
  },

  async updateLanguage(id: number, language: Partial<Language>): Promise<Language> {
    const { data } = await api.patch<Language>(`/education/languages/${id}`, language);
    return data;
  },

  async deleteLanguage(id: number): Promise<void> {
    await api.delete(`/education/languages/${id}`);
  },
};
