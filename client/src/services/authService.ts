import api from './api';
import type { AuthResponse, LoginCredentials } from '@/types/user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  async getProfile(): Promise<AuthResponse['user']> {
    const { data } = await api.get<AuthResponse['user']>('/auth/profile');
    return data;
  },
};
