export interface Education {
  id: number;
  school: string;
  department: string;
  degree: string;
  startDate?: string | null;
  endDate?: string | null;
  order: number;
}

export interface Language {
  id: number;
  name: string;
  level: string;
  order: number;
}

export interface EducationResponse {
  education: Education[];
  languages: Language[];
}
