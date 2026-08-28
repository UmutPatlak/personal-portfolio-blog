export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
}
