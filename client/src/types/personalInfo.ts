export interface PersonalInfo {
  id: number;
  name: string;
  title: string;
  bio: string;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  profileImage?: string | null;
  cvUrl?: string | null;
  updatedAt?: string;
}
