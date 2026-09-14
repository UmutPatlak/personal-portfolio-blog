import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BlogService } from './blog.service';
import { DATABASE_TOKEN } from '../db/database.module';
import { buildMockDb, type MockDb } from '../common/test-helpers';

describe('BlogService', () => {
  let service: BlogService;
  let mockDb: MockDb;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    slug: 'test-post-abc123',
    summary: 'A test post summary',
    content: 'This is the content of the test post with enough words to calculate reading time properly',
    coverImage: null,
    tags: ['nestjs', 'testing'],
    status: 'published' as const,
    readingTime: 1,
    authorId: 1,
    publishedAt: new Date('2024-06-01T00:00:00Z'),
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-06-01T00:00:00Z'),
  };

  const mockDraftPost = {
    ...mockPost,
    id: 2,
    title: 'Draft Post',
    slug: 'draft-post-xyz456',
    status: 'draft' as const,
    publishedAt: null,
  };

  beforeEach(async () => {
    mockDb = buildMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        { provide: DATABASE_TOKEN, useValue: mockDb },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll (public)', () => {
    it('should return paginated published posts', async () => {
      // findAll uses Promise.all with 2 selects:
      // 1st → data rows, 2nd → count
      mockDb._onSelect([mockPost], [{ count: 1 }]);

      const result = await service.findAll({});

      expect(result.data).toEqual([mockPost]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should default total to 0 when count result is empty', async () => {
      mockDb._onSelect([mockPost], [{}]);

      const result = await service.findAll({});

      expect(result.total).toBe(0);
      expect(result.limit).toBe(10);
    });

    it('should filter by tag', async () => {
      mockDb._onSelect([mockPost], [{ count: 1 }]);

      const result = await service.findAll({ tag: 'nestjs' });

      expect(result.data).toEqual([mockPost]);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it('should filter by search keyword', async () => {
      mockDb._onSelect([mockPost], [{ count: 1 }]);

      const result = await service.findAll({ search: 'Test' });

      expect(result.data).toEqual([mockPost]);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it('should filter by both tag and search', async () => {
      mockDb._onSelect([mockPost], [{ count: 1 }]);

      const result = await service.findAll({ tag: 'nestjs', search: 'Test' });

      expect(result.data).toEqual([mockPost]);
    });
  });

  describe('adminFindAll', () => {
    it('should return all posts including drafts when no status filter', async () => {
      mockDb._onSelect([mockPost, mockDraftPost], [{ count: 2 }]);

      const result = await service.adminFindAll({ status: 'all' });

      expect(result.data).toEqual([mockPost, mockDraftPost]);
      expect(result.total).toBe(2);
    });

    it('should filter by draft status', async () => {
      mockDb._onSelect([mockDraftPost], [{ count: 1 }]);

      const result = await service.adminFindAll({ status: 'draft' });

      expect(result.data).toEqual([mockDraftPost]);
      expect(result.total).toBe(1);
    });

    it('should filter by search keyword', async () => {
      mockDb._onSelect([mockPost], [{ count: 1 }]);

      const result = await service.adminFindAll({ search: 'Draft' });

      expect(result.data).toEqual([mockPost]);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it('should filter by published status', async () => {
      mockDb._onSelect([mockPost], [{ count: 1 }]);

      const result = await service.adminFindAll({ status: 'published' });

      expect(result.data).toEqual([mockPost]);
      expect(result.total).toBe(1);
    });

    it('should default total to 0 when count result is empty', async () => {
      mockDb._onSelect([], [{}]);

      const result = await service.adminFindAll({ status: 'all' });

      expect(result.total).toBe(0);
    });
  });

  describe('findBySlug', () => {
    it('should return post for existing slug', async () => {
      mockDb._onSelect([mockPost]);

      const result = await service.findBySlug('test-post-abc123');

      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException for non-existent slug', async () => {
      mockDb._onSelect([]);

      await expect(service.findBySlug('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return post for existing id', async () => {
      mockDb._onSelect([mockPost]);

      const result = await service.findById(1);

      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException for non-existent id', async () => {
      mockDb._onSelect([]);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a post with generated slug and reading time', async () => {
      mockDb._onInsert([mockPost]);

      const result = await service.create(
        {
          title: 'Test Post',
          summary: 'A test post summary',
          content: 'Some content here',
          tags: ['nestjs', 'testing'],
          status: 'published',
        },
        1,
      );

      expect(result).toEqual(mockPost);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update post and return it', async () => {
      const updated = { ...mockPost, title: 'Updated Post' };
      mockDb._onUpdate([updated]);

      const result = await service.update(1, { title: 'Updated Post' });

      expect(result.title).toBe('Updated Post');
    });

    it('should set publishedAt when status changes to published', async () => {
      mockDb._onUpdate([{ ...mockPost, status: 'published', publishedAt: new Date() }]);

      const result = await service.update(1, { status: 'published' });

      expect(result.status).toBe('published');
      expect(result.publishedAt).toBeTruthy();
    });

    it('should set publishedAt to null when status changes to draft', async () => {
      mockDb._onUpdate([{ ...mockDraftPost, publishedAt: null }]);

      const result = await service.update(2, { status: 'draft' });

      expect(result.publishedAt).toBeNull();
    });

    it('should regenerate slug when title is updated', async () => {
      const updated = { ...mockPost, title: 'New Cool Title', slug: 'new-cool-title-123' };
      mockDb._onUpdate([updated]);

      const result = await service.update(1, { title: 'New Cool Title' });

      expect(result.title).toBe('New Cool Title');
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('should recalculate readingTime when content is updated', async () => {
      const updated = { ...mockPost, content: 'Lots of new content...', readingTime: 3 };
      mockDb._onUpdate([updated]);

      const result = await service.update(1, { content: 'Lots of new content...' });

      expect(result.readingTime).toBe(3);
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existent id', async () => {
      mockDb._onUpdate([]);

      await expect(service.update(999, { title: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleStatus', () => {
    it('should toggle from published to draft', async () => {
      // findById: 1 select, then update: 1 update
      mockDb._onSelect([mockPost]);
      mockDb._onUpdate([{ ...mockPost, status: 'draft', publishedAt: null }]);

      const result = await service.toggleStatus(1);

      expect(result.status).toBe('draft');
    });

    it('should toggle from draft to published', async () => {
      mockDb._onSelect([mockDraftPost]);
      mockDb._onUpdate([{ ...mockDraftPost, status: 'published', publishedAt: new Date() }]);

      const result = await service.toggleStatus(2);

      expect(result.status).toBe('published');
    });

    it('should throw NotFoundException when toggling non-existent post', async () => {
      mockDb._onSelect([]);

      await expect(service.toggleStatus(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete and return success message', async () => {
      mockDb._onDelete([mockPost]);

      const result = await service.delete(1);

      expect(result).toEqual({ message: 'Post deleted successfully' });
    });

    it('should throw NotFoundException for non-existent id', async () => {
      mockDb._onDelete([]);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateSlug (private, tested via create)', () => {
    it('should generate a valid slug from title', async () => {
      // Capture the values passed to insert
      let capturedValues: any;
      mockDb.insert = jest.fn().mockImplementation(() => {
        return new Proxy(
          {},
          {
            get(_t, prop: string) {
              if (prop === 'then') {
                return (res: any) => res([mockPost]);
              }
              if (prop === 'values') {
                return jest.fn().mockImplementation((vals: any) => {
                  capturedValues = vals;
                  return new Proxy(
                    {},
                    {
                      get(_t2, p: string) {
                        if (p === 'then') return (res: any) => res([mockPost]);
                        return jest.fn().mockReturnValue(
                          new Proxy({}, { get: (_t3, p2: string) => p2 === 'then' ? (res: any) => res([mockPost]) : jest.fn() }),
                        );
                      },
                    },
                  );
                });
              }
              return jest.fn().mockReturnValue(
                new Proxy({}, { get: (_t2, p: string) => p === 'then' ? (res: any) => res([mockPost]) : jest.fn() }),
              );
            },
          },
        );
      });

      await service.create(
        {
          title: 'Hello World Test!',
          summary: 'summary',
          content: 'content',
          tags: [],
          status: 'draft',
        },
        1,
      );

      expect(capturedValues.slug).toMatch(/^hello-world-test-[a-z0-9]+$/);
    });
  });

  describe('calculateReadingTime (private, tested via create)', () => {
    it('should calculate reading time correctly for long content', async () => {
      const longContent = Array(400).fill('word').join(' ');

      let capturedValues: any;
      mockDb.insert = jest.fn().mockImplementation(() => {
        return new Proxy(
          {},
          {
            get(_t, prop: string) {
              if (prop === 'then') return (res: any) => res([mockPost]);
              if (prop === 'values') {
                return jest.fn().mockImplementation((vals: any) => {
                  capturedValues = vals;
                  return new Proxy(
                    {},
                    {
                      get(_t2, p: string) {
                        if (p === 'then') return (res: any) => res([mockPost]);
                        return jest.fn().mockReturnValue(
                          new Proxy({}, { get: (_t3, p2: string) => p2 === 'then' ? (res: any) => res([mockPost]) : jest.fn() }),
                        );
                      },
                    },
                  );
                });
              }
              return jest.fn().mockReturnValue(
                new Proxy({}, { get: (_t2, p: string) => p === 'then' ? (res: any) => res([mockPost]) : jest.fn() }),
              );
            },
          },
        );
      });

      await service.create(
        { title: 'Long', summary: 'summary', content: longContent, tags: [], status: 'draft' },
        1,
      );

      expect(capturedValues.readingTime).toBe(2);
    });

    it('should return minimum 1 minute for short content', async () => {
      let capturedValues: any;
      mockDb.insert = jest.fn().mockImplementation(() => {
        return new Proxy(
          {},
          {
            get(_t, prop: string) {
              if (prop === 'then') return (res: any) => res([mockPost]);
              if (prop === 'values') {
                return jest.fn().mockImplementation((vals: any) => {
                  capturedValues = vals;
                  return new Proxy(
                    {},
                    {
                      get(_t2, p: string) {
                        if (p === 'then') return (res: any) => res([mockPost]);
                        return jest.fn().mockReturnValue(
                          new Proxy({}, { get: (_t3, p2: string) => p2 === 'then' ? (res: any) => res([mockPost]) : jest.fn() }),
                        );
                      },
                    },
                  );
                });
              }
              return jest.fn().mockReturnValue(
                new Proxy({}, { get: (_t2, p: string) => p === 'then' ? (res: any) => res([mockPost]) : jest.fn() }),
              );
            },
          },
        );
      });

      await service.create(
        { title: 'Short', summary: 'summary', content: 'just a few words', tags: [], status: 'draft' },
        1,
      );

      expect(capturedValues.readingTime).toBe(1);
    });
  });

  describe('generateGeneralBlogOgSvg', () => {
    it('should return valid general SVG string', () => {
      const svg = service.generateGeneralBlogOgSvg();

      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('Software Architecture &amp; Modern Web Insights');
    });
  });

  describe('generateOgSvg', () => {
    it('should generate SVG with post details for existing slug', async () => {
      mockDb._onSelect([mockPost]);

      const svg = await service.generateOgSvg('test-post-abc123');

      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('Test Post');
      expect(svg).toContain('test-post-abc123');
      expect(svg).toContain('nestjs');
    });

    it('should handle post with long slug by truncating in display text', async () => {
      const longSlug = 'this-is-a-very-very-very-long-post-slug-that-exceeds-35-chars';
      const postWithLongSlug = { ...mockPost, slug: longSlug };
      mockDb._onSelect([postWithLongSlug]);

      const svg = await service.generateOgSvg(longSlug);

      expect(svg).toContain('<svg');
      expect(svg).toContain('this-is-a-very-very-very-long-po...');
    });

    it('should fallback to general blog SVG when post is not found', async () => {
      mockDb._onSelect([]);

      const svg = await service.generateOgSvg('non-existent-slug');

      expect(svg).toContain('<svg');
      expect(svg).toContain('Software Architecture &amp; Modern Web Insights');
    });

    it('should handle post with null title, tags, readingTime and unpublished date', async () => {
      const sparsePost = {
        ...mockPost,
        title: null,
        tags: null,
        readingTime: null,
        publishedAt: null,
      };
      mockDb._onSelect([sparsePost]);

      const svg = await service.generateOgSvg('test-post-abc123');

      expect(svg).toContain('<svg');
      expect(svg).toContain('Technical Article');
      expect(svg).toContain('5 min read');
      expect(svg).toContain('Published on your-domain.com');
    });
  });
});
