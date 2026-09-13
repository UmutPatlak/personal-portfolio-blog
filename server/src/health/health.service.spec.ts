import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { DATABASE_TOKEN } from '../db/database.module';

describe('HealthService', () => {
  let service: HealthService;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: DATABASE_TOKEN, useValue: mockDb },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  describe('checkDatabase', () => {
    it('should return true when database connection is successful', async () => {
      mockDb.execute.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.checkDatabase();

      expect(result).toBe(true);
      expect(mockDb.execute).toHaveBeenCalled();
    });

    it('should return false when database connection fails', async () => {
      mockDb.execute.mockRejectedValue(new Error('Connection refused'));

      const result = await service.checkDatabase();

      expect(result).toBe(false);
    });

    it('should return false on timeout error', async () => {
      mockDb.execute.mockRejectedValue(new Error('timeout'));

      const result = await service.checkDatabase();

      expect(result).toBe(false);
    });
  });
});
