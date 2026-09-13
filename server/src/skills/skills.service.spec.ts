import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { DATABASE_TOKEN } from '../db/database.module';
import { buildMockDb, type MockDb } from '../common/test-helpers';

describe('SkillsService', () => {
  let service: SkillsService;
  let mockDb: MockDb;

  const mockCategory = { id: 1, name: 'Frontend', icon: 'react', order: 0 };
  const mockSkill = { id: 1, categoryId: 1, name: 'React', order: 0 };

  beforeEach(async () => {
    mockDb = buildMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        { provide: DATABASE_TOKEN, useValue: mockDb },
      ],
    }).compile();

    service = module.get<SkillsService>(SkillsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return categories with skills', async () => {
      // 1st select → categories, 2nd select → skills
      mockDb._onSelect([mockCategory], [mockSkill]);

      const result = await service.findAll();

      expect(result).toEqual([{ ...mockCategory, skills: [mockSkill] }]);
    });

    it('should return empty array when no categories', async () => {
      mockDb._onSelect([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('createCategory', () => {
    it('should create a category with empty skills array', async () => {
      mockDb._onInsert([mockCategory]);

      const result = await service.createCategory({ name: 'Frontend', icon: 'react' });

      expect(result).toEqual({ ...mockCategory, skills: [] });
    });
  });

  describe('updateCategory', () => {
    it('should update and return the category', async () => {
      const updated = { ...mockCategory, name: 'Backend' };
      mockDb._onUpdate([updated]);

      const result = await service.updateCategory(1, { name: 'Backend' });

      expect(result.name).toBe('Backend');
    });

    it('should throw NotFoundException for non-existent category', async () => {
      mockDb._onUpdate([]);

      await expect(service.updateCategory(999, { name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCategory', () => {
    it('should delete and return success message', async () => {
      mockDb._onDelete([mockCategory]);

      const result = await service.deleteCategory(1);

      expect(result).toEqual({ message: 'Category deleted successfully' });
    });

    it('should throw NotFoundException for non-existent category', async () => {
      mockDb._onDelete([]);

      await expect(service.deleteCategory(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addSkill', () => {
    it('should create and return a new skill', async () => {
      mockDb._onInsert([mockSkill]);

      const result = await service.addSkill({ categoryId: 1, name: 'React' });

      expect(result).toEqual(mockSkill);
    });
  });

  describe('updateSkill', () => {
    it('should update and return the skill', async () => {
      const updated = { ...mockSkill, name: 'Vue' };
      mockDb._onUpdate([updated]);

      const result = await service.updateSkill(1, { name: 'Vue' });

      expect(result.name).toBe('Vue');
    });

    it('should throw NotFoundException for non-existent skill', async () => {
      mockDb._onUpdate([]);

      await expect(service.updateSkill(999, { name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteSkill', () => {
    it('should delete and return success message', async () => {
      mockDb._onDelete([mockSkill]);

      const result = await service.deleteSkill(1);

      expect(result).toEqual({ message: 'Skill deleted successfully' });
    });

    it('should throw NotFoundException for non-existent skill', async () => {
      mockDb._onDelete([]);

      await expect(service.deleteSkill(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('reorderCategories', () => {
    it('should update order for each category', async () => {
      const result = await service.reorderCategories([
        { id: 1, order: 2 },
        { id: 2, order: 1 },
      ]);

      expect(result).toEqual({ message: 'Categories reordered successfully' });
      expect(mockDb.update).toHaveBeenCalledTimes(2);
    });
  });

  describe('reorderSkills', () => {
    it('should update order for each skill', async () => {
      const result = await service.reorderSkills([
        { id: 1, order: 2 },
        { id: 2, order: 1 },
      ]);

      expect(result).toEqual({ message: 'Skills reordered successfully' });
      expect(mockDb.update).toHaveBeenCalledTimes(2);
    });
  });
});
