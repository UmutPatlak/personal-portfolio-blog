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
    const baseUrl = this.configService.get<string>('FRONTEND_URL') || 'https://umutpatlak.com';
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Static pages
    const pages = ['', '/about', '/projects', '/blog', '/contact'];
    for (const page of pages) {
        xml += `  <url><loc>${baseUrl}${page}</loc></url>\n`;
    }

    // Blog posts
    for (const post of publishedPosts) {
        xml += `  <url><loc>${baseUrl}/blog/${post.slug}</loc><lastmod>${post.publishedAt?.toISOString() || post.createdAt.toISOString()}</lastmod></url>\n`;
    }

    // Projects
    for (const project of allProjects) {
        xml += `  <url><loc>${baseUrl}/projects/${project.id}</loc></url>\n`;
    }

    xml += '</urlset>';
    return xml;
  }
}
