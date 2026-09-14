import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DATABASE_TOKEN } from '../db/database.module';
import { posts } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SitemapService {
  constructor(
    @Inject(DATABASE_TOKEN) private readonly db: any,
    private readonly configService: ConfigService,
  ) {}

  async getPublishedPosts() {
    return this.db
      .select()
      .from(posts)
      .where(eq(posts.status, 'published'));
  }

  async getSitemapData() {
    const publishedPosts = await this.getPublishedPosts();
    return { publishedPosts };
  }

  async generateSitemapXml(): Promise<string> {
    const publishedPosts = await this.getPublishedPosts();
    const rawBaseUrl =
      this.configService.get<string>('FRONTEND_URL') || 'https://your-domain.com';
    const baseUrl = rawBaseUrl.replace(/\/+$/, '');

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static client routes matching App.tsx
    const pages = ['', '/blog', '/projects/ocpp-gateway'];
    for (const page of pages) {
      xml += `  <url><loc>${baseUrl}${page}</loc><changefreq>${page === '' ? 'weekly' : page === '/blog' ? 'daily' : 'monthly'}</changefreq><priority>${page === '' ? '1.0' : page === '/blog' ? '0.8' : '0.9'}</priority></url>\n`;
    }

    // Published Blog posts
    for (const post of publishedPosts) {
      const lastmod =
        post.publishedAt?.toISOString() || post.createdAt?.toISOString() || new Date().toISOString();
      xml += `  <url><loc>${baseUrl}/blog/${post.slug}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
    }

    xml += '</urlset>';
    return xml;
  }
}
