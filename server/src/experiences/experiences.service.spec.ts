import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { DATABASE_TOKEN } from '../db/database.module';
import { buildMockDb, type MockDb } from '../common/test-helpers';

describe('ExperiencesService', () => {
  let service: ExperiencesService;
  let mockDb: MockDb;

  const mockExperience = {
    id: 1,
    company: 'Acme Corp',
    position: 'Software Engineer',
    location: 'Istanbul',
    startDate: '2023-01',
    endDate: null,
    description: 'Full stack development',
    order: 0,
    createdAt: new Date('2024-01-01T00:00:00Z'),
  };

  const mockAchievement = {
    id: 1,
    experienceId: 1,
    content: 'Built scalable microservices',
    order: 0,
  };

  beforeEach(async () => {
    mockDb = buildMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperiencesService,
        { provide: DATABASE_TOKEN, useValue: mockDb },
      ],
    }).compile();

    service = module.get<ExperiencesService>(ExperiencesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return experiences with achievements', async () => {
      mockDb._onSelect([mockExperience], [mockAchievement]);

      const result = await service.findAll();

      expect(result).toEqual([
        { ...mockExperience, achievements: ['Built scalable microservices'] },
      ]);
    });

    it('should return empty array when no experiences', async () => {
      mockDb._onSelect([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return experience with achievements', async () => {
      mockDb._onSelect([mockExperience], [mockAchievement]);

      const result = await service.findOne(1);

      expect(result).toEqual({
        ...mockExperience,
        achievements: ['Built scalable microservices'],
      });
    });

    it('should throw NotFoundException for non-existent id', async () => {
      mockDb._onSelect([]);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create experience and return it with achievements', async () => {
      mockDb._onInsert([mockExperience]);
      mockDb._onSelect([mockExperience], []);

      const result = await service.create({
        company: 'Acme Corp',
        position: 'Software Engineer',
        startDate: '2023-01',
      });

      expect(result).toEqual({ ...mockExperience, achievements: [] });
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update experience and return it', async () => {
      const updated = { ...mockExperience, company: 'New Corp' };
      mockDb._onUpdate([updated]);
      mockDb._onSelect([updated], []);

      const result = await service.update(1, { company: 'New Corp' });

      expect(result.company).toBe('New Corp');
    });

    it('should throw NotFoundException when updating non-existent experience', async () => {
      mockDb._onUpdate([]);

      await expect(
        service.update(999, { company: 'New Corp' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete experience and return success message', async () => {
      mockDb._onDelete([mockExperience]);

      const result = await service.delete(1);

      expect(result).toEqual({ message: 'Experience deleted successfully' });
    });

    it('should throw NotFoundException when deleting non-existent experience', async () => {
      mockDb._onDelete([]);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('reorder', () => {
    it('should update order for each item', async () => {
      const result = await service.reorder([
        { id: 1, order: 2 },
        { id: 2, order: 1 },
      ]);

      expect(result).toEqual({ message: 'Experiences reordered successfully' });
      expect(mockDb.update).toHaveBeenCalledTimes(2);
    });
  });
});
