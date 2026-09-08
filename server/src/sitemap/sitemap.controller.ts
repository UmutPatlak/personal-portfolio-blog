import { Controller, Get, Header } from '@nestjs/common';
import { SitemapService } from './sitemap.service';
import { ConfigService } from '@nestjs/config';

@Controller('sitemap.xml')
export class SitemapController {
  constructor(
    private readonly sitemapService: SitemapService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @Header('Content-Type', 'application/xml')
  async getSitemap() {
    const { publishedPosts, allProjects } = await this.sitemapService.getSitemapData();
    const rawBaseUrl = this.configService.get<string>('FRONTEND_URL') || 'https://your-domain.com';
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
        xml += `  <url><loc>${baseUrl}/blog/${post.slug}</loc><lastmod>${post.publishedAt?.toISOString() || post.createdAt.toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
    }

    xml += '</urlset>';
    return xml;
  }
}
