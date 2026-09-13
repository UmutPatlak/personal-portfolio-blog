import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ContactService } from './contact.service';
import { DATABASE_TOKEN } from '../db/database.module';
import { buildMockDb, type MockDb } from '../common/test-helpers';

describe('ContactService', () => {
  let service: ContactService;
  let mockDb: MockDb;

  const mockMessage = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Hello',
    message: 'This is a test message',
    isRead: false,
    createdAt: new Date('2024-01-01T00:00:00Z'),
  };

  beforeEach(async () => {
    mockDb = buildMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: DATABASE_TOKEN, useValue: mockDb },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a message and return success', async () => {
      const result = await service.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Hello',
        message: 'This is a test message',
      });

      expect(result).toEqual({ message: 'Message sent successfully' });
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all messages ordered by createdAt desc', async () => {
      mockDb._onSelect([mockMessage]);

      const result = await service.findAll();

      expect(result).toEqual([mockMessage]);
    });
  });

  describe('markAsRead', () => {
    it('should mark a message as read', async () => {
      const readMessage = { ...mockMessage, isRead: true };
      mockDb._onUpdate([readMessage]);

      const result = await service.markAsRead(1);

      expect(result.isRead).toBe(true);
    });

    it('should throw NotFoundException for non-existent message', async () => {
      mockDb._onUpdate([]);

      await expect(service.markAsRead(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAsUnread', () => {
    it('should mark a message as unread', async () => {
      const unreadMessage = { ...mockMessage, isRead: false };
      mockDb._onUpdate([unreadMessage]);

      const result = await service.markAsUnread(1);

      expect(result.isRead).toBe(false);
    });

    it('should throw NotFoundException for non-existent message', async () => {
      mockDb._onUpdate([]);

      await expect(service.markAsUnread(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleRead', () => {
    it('should toggle from unread to read', async () => {
      // 1st select → get current state, then update → toggle
      mockDb._onSelect([{ ...mockMessage, isRead: false }]);
      mockDb._onUpdate([{ ...mockMessage, isRead: true }]);

      const result = await service.toggleRead(1);

      expect(result.isRead).toBe(true);
    });

    it('should toggle from read to unread', async () => {
      mockDb._onSelect([{ ...mockMessage, isRead: true }]);
      mockDb._onUpdate([{ ...mockMessage, isRead: false }]);

      const result = await service.toggleRead(1);

      expect(result.isRead).toBe(false);
    });

    it('should throw NotFoundException when message not found', async () => {
      mockDb._onSelect([]);

      await expect(service.toggleRead(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a message and return success', async () => {
      mockDb._onDelete([mockMessage]);

      const result = await service.delete(1);

      expect(result).toEqual({ message: 'Message deleted successfully' });
    });

    it('should throw NotFoundException for non-existent message', async () => {
      mockDb._onDelete([]);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });
  });
});
