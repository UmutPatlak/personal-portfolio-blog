import api from './api';
import type { ContactFormData, ContactMessage } from '@/types/contact';

export const contactService = {
  async sendMessage(data: ContactFormData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/contact', data);
    return response.data;
  },

  async getMessages(): Promise<ContactMessage[]> {
    const { data } = await api.get<ContactMessage[]>('/contact');
    return data;
  },

  async markAsRead(id: number): Promise<void> {
    await api.patch(`/contact/${id}/read`);
  },
};
