export interface Project {
  id: number;
  title: string;
  type?: string | null;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  architecture?: string | null;
  challenges?: string[] | null;
  solutions?: string[] | null;
  featured: boolean;
  order: number;
  createdAt: string;
}
