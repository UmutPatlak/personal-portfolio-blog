import api from './api';
import type { PersonalInfo } from '@/types/personalInfo';

export const personalInfoService = {
  async getPersonalInfo(): Promise<PersonalInfo> {
    const { data } = await api.get<PersonalInfo>('/personal-info');
    return data;
  },

  async updatePersonalInfo(info: Partial<PersonalInfo>): Promise<PersonalInfo> {
    const { data } = await api.patch<PersonalInfo>('/personal-info', info);
    return data;
  },
};
