export interface SkillItem {
  id: number;
  categoryId: number;
  name: string;
  order: number;
}

export interface SkillCategoryWithSkills {
  id: number;
  name: string;
  icon?: string | null;
  order: number;
  skills: SkillItem[];
}
