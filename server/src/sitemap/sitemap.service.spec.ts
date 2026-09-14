import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SitemapService } from './sitemap.service';
import { DATABASE_TOKEN } from '../db/database.module';
import { buildMockDb, type MockDb } from '../common/test-helpers';

describe('SitemapService', () => {
  let service: SitemapService;
  let mockDb: MockDb;
  let mockConfigService: { get: jest.Mock };

  const publishedPost = {
    id: 1,
    title: 'Published Post',
    slug: 'published-post',
    status: 'published',
    publishedAt: new Date('2024-06-01T00:00:00Z'),
    createdAt: new Date('2024-01-01T00:00:00Z'),
  };

  beforeEach(async () => {
    mockDb = buildMockDb();
    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'FRONTEND_URL') return 'https://umutpatlak.com';
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SitemapService,
        { provide: DATABASE_TOKEN, useValue: mockDb },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<SitemapService>(SitemapService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPublishedPosts & getSitemapData', () => {
    it('should return only published posts', async () => {
      mockDb._onSelect([publishedPost]);

      const result = await service.getPublishedPosts();

      expect(result).toEqual([publishedPost]);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it('should return empty array when no published posts', async () => {
      mockDb._onSelect([]);

      const result = await service.getPublishedPosts();

      expect(result).toEqual([]);
    });

    it('should return published posts wrapped in getSitemapData', async () => {
      mockDb._onSelect([publishedPost]);

      const result = await service.getSitemapData();

      expect(result).toEqual({ publishedPosts: [publishedPost] });
    });
  });

  describe('generateSitemapXml', () => {
    it('should generate valid sitemap XML with static pages and published posts', async () => {
      mockDb._onSelect([publishedPost]);

      const xml = await service.generateSitemapXml();

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('<loc>https://umutpatlak.com</loc>');
      expect(xml).toContain('<loc>https://umutpatlak.com/blog</loc>');
      expect(xml).toContain('<loc>https://umutpatlak.com/projects/ocpp-gateway</loc>');
      expect(xml).toContain('<loc>https://umutpatlak.com/blog/published-post</loc>');
      expect(xml).toContain('<lastmod>2024-06-01T00:00:00.000Z</lastmod>');
      expect(xml).toContain('</urlset>');
    });

    it('should use default domain when FRONTEND_URL is not set', async () => {
      mockConfigService.get.mockReturnValue(undefined);
      mockDb._onSelect([]);

      const xml = await service.generateSitemapXml();

      expect(xml).toContain('<loc>https://your-domain.com</loc>');
      expect(xml).toContain('<loc>https://your-domain.com/blog</loc>');
    });

    it('should strip trailing slash from FRONTEND_URL', async () => {
      mockConfigService.get.mockReturnValue('https://umutpatlak.com///');
      mockDb._onSelect([]);

      const xml = await service.generateSitemapXml();

      expect(xml).toContain('<loc>https://umutpatlak.com</loc>');
      expect(xml).not.toContain('https://umutpatlak.com///');
    });

    it('should fallback to current date when post has no publishedAt or createdAt', async () => {
      const postNoDate = { ...publishedPost, publishedAt: null, createdAt: null };
      mockDb._onSelect([postNoDate]);

      const xml = await service.generateSitemapXml();

      expect(xml).toContain('<loc>https://umutpatlak.com/blog/published-post</loc>');
      expect(xml).toContain('<lastmod>');
    });
  });
});
