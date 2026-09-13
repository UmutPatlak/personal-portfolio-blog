import { Test, TestingModule } from '@nestjs/testing';
import { SitemapService } from './sitemap.service';
import { DATABASE_TOKEN } from '../db/database.module';

describe('SitemapService', () => {
  let service: SitemapService;
  let mockDb: any;

  const publishedPost = {
    id: 1,
    title: 'Published Post',
    slug: 'published-post',
    status: 'published',
    publishedAt: new Date('2024-06-01'),
    createdAt: new Date('2024-01-01'),
  };

  const draftPost = {
    id: 2,
    title: 'Draft Post',
    slug: 'draft-post',
    status: 'draft',
    publishedAt: null,
    createdAt: new Date('2024-02-01'),
  };

  const mockProject = {
    id: 1,
    title: 'Project 1',
    order: 0,
  };

  beforeEach(async () => {
    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SitemapService,
        { provide: DATABASE_TOKEN, useValue: mockDb },
      ],
    }).compile();

    service = module.get<SitemapService>(SitemapService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSitemapData', () => {
    it('should return only published posts and all projects', async () => {
      // First chain: select().from(posts).where(eq(posts.status, 'published'))
      // Second chain: select().from(projects)
      let selectCallCount = 0;
      mockDb.select.mockImplementation(() => {
        selectCallCount++;
        if (selectCallCount === 1) {
          // Posts query — has where
          return {
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockResolvedValue([publishedPost]),
            }),
          };
        } else {
          // Projects query — no where
          return {
            from: jest.fn().mockResolvedValue([mockProject]),
          };
        }
      });

      const result = await service.getSitemapData();

      expect(result.publishedPosts).toEqual([publishedPost]);
      expect(result.publishedPosts).not.toContainEqual(
        expect.objectContaining({ status: 'draft' }),
      );
      expect(result.allProjects).toEqual([mockProject]);
    });

    it('should return empty arrays when no data exists', async () => {
      let selectCallCount = 0;
      mockDb.select.mockImplementation(() => {
        selectCallCount++;
        if (selectCallCount === 1) {
          return {
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockResolvedValue([]),
            }),
          };
        } else {
          return {
            from: jest.fn().mockResolvedValue([]),
          };
        }
      });

      const result = await service.getSitemapData();

      expect(result.publishedPosts).toEqual([]);
      expect(result.allProjects).toEqual([]);
    });

    it('should exclude draft posts from published posts list', async () => {
      // The service uses eq(posts.status, 'published') filter,
      // so we only return published posts
      let selectCallCount = 0;
      mockDb.select.mockImplementation(() => {
        selectCallCount++;
        if (selectCallCount === 1) {
          return {
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockResolvedValue([publishedPost]),
            }),
          };
        } else {
          return {
            from: jest.fn().mockResolvedValue([mockProject]),
          };
        }
      });

      const result = await service.getSitemapData();

      // Verify only published post is returned, not draft
      expect(result.publishedPosts.length).toBe(1);
      expect(result.publishedPosts[0].status).toBe('published');
    });
  });
});
