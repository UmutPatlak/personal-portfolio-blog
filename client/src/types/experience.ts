export interface Experience {
  id: number;
  company: string;
  position: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  order: number;
  achievements: string[];
  createdAt?: string;
}
