import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { DATABASE_TOKEN } from '../db/database.module';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let mockDb: any;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    passwordHash: '$2b$10$hashedpassword',
    name: 'Test User',
    createdAt: new Date('2024-01-01T00:00:00Z'),
  };

  beforeEach(async () => {
    // Drizzle chained query builder mock
    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DATABASE_TOKEN,
          useValue: mockDb,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return accessToken and user on valid credentials', async () => {
      mockDb.limit.mockResolvedValue([mockUser]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          createdAt: mockUser.createdAt.toISOString(),
        },
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@example.com',
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockDb.limit.mockResolvedValue([]);

      await expect(
        service.login({ email: 'nobody@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockDb.limit.mockResolvedValue([mockUser]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile for valid userId', async () => {
      const profile = { id: 1, email: 'test@example.com', name: 'Test User', createdAt: new Date() };
      mockDb.limit.mockResolvedValue([profile]);

      const result = await service.getProfile(1);

      expect(result).toEqual(profile);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockDb.limit.mockResolvedValue([]);

      await expect(service.getProfile(999)).rejects.toThrow(UnauthorizedException);
    });
  });
});
