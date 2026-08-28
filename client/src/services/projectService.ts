import api from './api';
import type { Project } from '@/types/project';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const { data } = await api.get<Project[]>('/projects');
    return data;
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const { data } = await api.post<Project>('/projects', project);
    return data;
  },

  async updateProject(id: number, project: Partial<Project>): Promise<Project> {
    const { data } = await api.patch<Project>(`/projects/${id}`, project);
    return data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
