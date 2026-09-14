import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { DATABASE_TOKEN } from '../db/database.module';
import { buildMockDb, type MockDb } from '../common/test-helpers';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let mockDb: MockDb;

  const mockProject = {
    id: 1,
    title: 'My Project',
    type: 'web',
    description: 'A cool project',
    technologies: ['React', 'Node.js'],
    githubUrl: 'https://github.com/test',
    demoUrl: 'https://demo.com',
    imageUrl: '/uploads/images/project.png',
    featured: true,
    order: 0,
    architecture: null,
    challenges: null,
    solutions: null,
    createdAt: new Date('2024-01-01T00:00:00Z'),
  };

  beforeEach(async () => {
    mockDb = buildMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: DATABASE_TOKEN, useValue: mockDb },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all projects ordered', async () => {
      mockDb._onSelect([mockProject]);

      const result = await service.findAll();

      expect(result).toEqual([mockProject]);
    });

    it('should return empty array when no projects exist', async () => {
      mockDb._onSelect([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      mockDb._onSelect([mockProject]);

      const result = await service.findOne(1);

      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException for non-existent id', async () => {
      mockDb._onSelect([]);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new project', async () => {
      mockDb._onInsert([mockProject]);

      const result = await service.create({
        title: 'My Project',
        description: 'A cool project',
        technologies: ['React', 'Node.js'],
      });

      expect(result).toEqual(mockProject);
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should handle creation with empty/omitted technologies defaulting to empty array', async () => {
      const projectWithoutTech = { ...mockProject, technologies: [] };
      mockDb._onInsert([projectWithoutTech]);

      const result = await service.create({
        title: 'My Project',
        description: 'A cool project',
      } as any);

      expect(result.technologies).toEqual([]);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the project', async () => {
      const updated = { ...mockProject, title: 'Updated Project' };
      mockDb._onUpdate([updated]);

      const result = await service.update(1, { title: 'Updated Project' });

      expect(result.title).toBe('Updated Project');
    });

    it('should throw NotFoundException when updating non-existent project', async () => {
      mockDb._onUpdate([]);

      await expect(
        service.update(999, { title: 'No Project' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete and return success message', async () => {
      mockDb._onDelete([mockProject]);

      const result = await service.delete(1);

      expect(result).toEqual({ message: 'Project deleted successfully' });
    });

    it('should throw NotFoundException when deleting non-existent project', async () => {
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

      expect(result).toEqual({ message: 'Projects reordered successfully' });
      expect(mockDb.update).toHaveBeenCalledTimes(2);
    });
  });
});
