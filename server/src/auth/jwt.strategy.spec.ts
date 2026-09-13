import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    const configService = {
      getOrThrow: jest.fn().mockReturnValue('test-jwt-secret'),
    } as unknown as ConfigService;

    strategy = new JwtStrategy(configService);
  });

  describe('validate', () => {
    it('should return userId and email from JWT payload', () => {
      const payload = { sub: 1, email: 'test@example.com' };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 1,
        email: 'test@example.com',
      });
    });

    it('should handle different user IDs correctly', () => {
      const payload = { sub: 42, email: 'admin@example.com' };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 42,
        email: 'admin@example.com',
      });
    });
  });

  describe('constructor', () => {
    it('should use JWT_SECRET from ConfigService', () => {
      const mockGetOrThrow = jest.fn().mockReturnValue('my-secret');
      const configService = {
        getOrThrow: mockGetOrThrow,
      } as unknown as ConfigService;

      new JwtStrategy(configService);

      expect(mockGetOrThrow).toHaveBeenCalledWith('JWT_SECRET');
    });
  });
});
