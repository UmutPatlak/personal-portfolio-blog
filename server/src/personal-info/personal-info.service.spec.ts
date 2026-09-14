import { Test, TestingModule } from '@nestjs/testing';
import { PersonalInfoService } from './personal-info.service';
import { DATABASE_TOKEN } from '../db/database.module';
import { buildMockDb, type MockDb } from '../common/test-helpers';

describe('PersonalInfoService', () => {
  let service: PersonalInfoService;
  let mockDb: MockDb;

  const mockInfo = {
    id: 1,
    name: 'Umut Patlak',
    title: 'Full-Stack Developer',
    bio: 'Software engineer passionate about scalable architectures.',
    location: 'Istanbul, Turkey',
    email: 'contact@umutpatlak.com',
    phone: '+905555555555',
    githubUrl: 'https://github.com/umutpatlak',
    linkedinUrl: 'https://linkedin.com/in/umutpatlak',
    profileImage: '/uploads/images/profile.jpg',
    cvUrl: '/uploads/documents/cv.pdf',
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  };

  beforeEach(async () => {
    mockDb = buildMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonalInfoService,
        { provide: DATABASE_TOKEN, useValue: mockDb },
      ],
    }).compile();

    service = module.get<PersonalInfoService>(PersonalInfoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return existing personal info when present', async () => {
      mockDb._onSelect([mockInfo]);

      const result = await service.get();

      expect(result).toEqual(mockInfo);
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.insert).not.toHaveBeenCalled();
    });

    it('should create and return default personal info when none exists in DB', async () => {
      const defaultCreated = {
        id: 1,
        name: 'Umut Patlak',
        title: 'Full-Stack Developer',
        bio: '',
        location: null,
        email: null,
        phone: null,
        githubUrl: null,
        linkedinUrl: null,
        profileImage: null,
        cvUrl: null,
        updatedAt: new Date(),
      };

      // 1st select returns empty -> triggers default insert returning defaultCreated
      mockDb._onSelect([]);
      mockDb._onInsert([defaultCreated]);

      const result = await service.get();

      expect(result).toEqual(defaultCreated);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update personal info and return updated record', async () => {
      const updatedInfo = {
        ...mockInfo,
        bio: 'Updated bio description',
        location: 'Berlin, Germany',
      };

      // get() does select -> mockInfo
      mockDb._onSelect([mockInfo]);
      // update() does update -> updatedInfo
      mockDb._onUpdate([updatedInfo]);

      const result = await service.update({
        bio: 'Updated bio description',
        location: 'Berlin, Germany',
      });

      expect(result).toEqual(updatedInfo);
      expect(mockDb.update).toHaveBeenCalled();
    });
  });
});
