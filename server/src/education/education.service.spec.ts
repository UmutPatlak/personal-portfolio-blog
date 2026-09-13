import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EducationService } from './education.service';
import { DATABASE_TOKEN } from '../db/database.module';
import { buildMockDb, type MockDb } from '../common/test-helpers';

describe('EducationService', () => {
  let service: EducationService;
  let mockDb: MockDb;

  const mockEducation = {
    id: 1, school: 'MIT', department: 'Computer Science', degree: 'BSc',
    startDate: '2018', endDate: '2022', order: 0,
  };

  const mockLanguage = {
    id: 1, name: 'English', level: 'Native', order: 0,
  };

  beforeEach(async () => {
    mockDb = buildMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EducationService,
        { provide: DATABASE_TOKEN, useValue: mockDb },
      ],
    }).compile();

    service = module.get<EducationService>(EducationService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return education and languages', async () => {
      // findAll uses Promise.all: 1st select → education, 2nd select → languages
      mockDb._onSelect([mockEducation], [mockLanguage]);

      const result = await service.findAll();

      expect(result).toEqual({
        education: [mockEducation],
        languages: [mockLanguage],
      });
    });
  });

  // ─── Education CRUD ────────────────────────────────────

  describe('createEducation', () => {
    it('should create and return a new education item', async () => {
      mockDb._onInsert([mockEducation]);

      const result = await service.createEducation({
        school: 'MIT', department: 'Computer Science', degree: 'BSc',
      });

      expect(result).toEqual(mockEducation);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('updateEducation', () => {
    it('should update and return the education item', async () => {
      const updated = { ...mockEducation, school: 'Stanford' };
      mockDb._onUpdate([updated]);

      const result = await service.updateEducation(1, { school: 'Stanford' });

      expect(result.school).toBe('Stanford');
    });

    it('should throw NotFoundException for non-existent id', async () => {
      mockDb._onUpdate([]);

      await expect(service.updateEducation(999, { school: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteEducation', () => {
    it('should delete and return success message', async () => {
      mockDb._onDelete([mockEducation]);

      const result = await service.deleteEducation(1);

      expect(result).toEqual({ message: 'Education item deleted successfully' });
    });

    it('should throw NotFoundException for non-existent id', async () => {
      mockDb._onDelete([]);

      await expect(service.deleteEducation(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── Language CRUD ────────────────────────────────────

  describe('createLanguage', () => {
    it('should create and return a new language item', async () => {
      mockDb._onInsert([mockLanguage]);

      const result = await service.createLanguage({ name: 'English', level: 'Native' });

      expect(result).toEqual(mockLanguage);
    });
  });

  describe('updateLanguage', () => {
    it('should update and return the language item', async () => {
      const updated = { ...mockLanguage, level: 'Fluent' };
      mockDb._onUpdate([updated]);

      const result = await service.updateLanguage(1, { level: 'Fluent' });

      expect(result.level).toBe('Fluent');
    });

    it('should throw NotFoundException for non-existent id', async () => {
      mockDb._onUpdate([]);

      await expect(service.updateLanguage(999, { level: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteLanguage', () => {
    it('should delete and return success message', async () => {
      mockDb._onDelete([mockLanguage]);

      const result = await service.deleteLanguage(1);

      expect(result).toEqual({ message: 'Language item deleted successfully' });
    });

    it('should throw NotFoundException for non-existent id', async () => {
      mockDb._onDelete([]);

      await expect(service.deleteLanguage(999)).rejects.toThrow(NotFoundException);
    });
  });
});
