import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc, and, ilike, arrayContains, sql } from 'drizzle-orm';
import { DATABASE_TOKEN } from '../db/database.module';
import { type Database } from '../config/database';
import { posts } from '../db/schema';
import type { CreatePostDto } from './dto/create-post.dto';
import type { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class BlogService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async findAll(query: { page?: number; limit?: number; tag?: string; search?: string }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const conditions = [eq(posts.status, 'published')];

    if (query.tag) {
      conditions.push(arrayContains(posts.tags, [query.tag]));
    }

    if (query.search) {
      conditions.push(ilike(posts.title, `%${query.search}%`));
    }

    const where = and(...conditions);

    const [data, countResult] = await Promise.all([
      this.db
        .select()
        .from(posts)
        .where(where)
        .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .where(where),
    ]);

    return {
      data,
      total: Number(countResult[0]?.count ?? 0),
      page,
      limit,
    };
  }

  async adminFindAll(query: { page?: number; limit?: number; status?: string; search?: string }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.status && query.status !== 'all') {
      conditions.push(eq(posts.status, query.status as 'draft' | 'published'));
    }

    if (query.search) {
      conditions.push(ilike(posts.title, `%${query.search}%`));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      this.db
        .select()
        .from(posts)
        .where(where)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .where(where),
    ]);

    return {
      data,
      total: Number(countResult[0]?.count ?? 0),
      page,
      limit,
    };
  }

  async findBySlug(slug: string) {
    const [post] = await this.db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findById(id: number) {
    const [post] = await this.db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async create(dto: CreatePostDto, authorId: number) {
    const slug = this.generateSlug(dto.title);
    const readingTime = this.calculateReadingTime(dto.content);

    const [post] = await this.db
      .insert(posts)
      .values({
        title: dto.title,
        slug,
        summary: dto.summary,
        content: dto.content,
        coverImage: dto.coverImage ?? null,
        tags: dto.tags,
        status: dto.status,
        readingTime,
        authorId,
        publishedAt: dto.status === 'published' ? new Date() : null,
      })
      .returning();

    return post;
  }

  async update(id: number, dto: UpdatePostDto) {
    const updateData: Record<string, unknown> = { ...dto, updatedAt: new Date() };

    if (dto.title) {
      updateData.slug = this.generateSlug(dto.title);
    }

    if (dto.content) {
      updateData.readingTime = this.calculateReadingTime(dto.content);
    }

    if (dto.status === 'published') {
      updateData.publishedAt = new Date();
    } else if (dto.status === 'draft') {
      updateData.publishedAt = null;
    }

    const [post] = await this.db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async toggleStatus(id: number) {
    const post = await this.findById(id);
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    return this.update(id, {
      status: newStatus,
    });
  }

  async delete(id: number) {
    const [post] = await this.db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return { message: 'Post deleted successfully' };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .concat('-', Date.now().toString(36));
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }

  async generateOgSvg(slug: string): Promise<string> {
    let post;
    try {
      post = await this.findBySlug(slug);
    } catch {
      return this.generateGeneralBlogOgSvg();
    }

    const escapeXml = (str: string) =>
      (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    const title = escapeXml(post.title || 'Technical Article');
    const tags = (post.tags || []).slice(0, 4);
    const readingTime = post.readingTime || 5;
    const dateStr = post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Published on umutpatlak.com';

    const tagsHtml = tags
      .map(
        (t) =>
          `<span style="display:inline-block;padding:6px 14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;font-family:monospace;font-size:14px;font-weight:600;color:#cbd5e1;margin-right:10px;"><span style="color:#06b6d4;">#</span>${escapeXml(t)}</span>`
      )
      .join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1322" />
      <stop offset="100%" stop-color="#07090e" />
    </linearGradient>
    <radialGradient id="purpleGlow" cx="20%" cy="20%" r="50%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="cyanGlow" cx="80%" cy="80%" r="50%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="630" fill="url(#purpleGlow)" />
  <rect width="1200" height="630" fill="url(#cyanGlow)" />

  <rect x="50" y="45" width="1100" height="540" rx="20" fill="#0f1420" fill-opacity="0.88" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />

  <path d="M 50 65 Q 50 45 70 45 L 1130 45 Q 1150 45 1150 65 L 1150 97 L 50 97 Z" fill="#0a0e18" fill-opacity="0.95" />
  <line x1="50" y1="97" x2="1150" y2="97" stroke="rgba(255,255,255,0.08)" stroke-width="1" />

  <circle cx="80" cy="71" r="6" fill="#ef4444" />
  <circle cx="102" cy="71" r="6" fill="#eab308" />
  <circle cx="124" cy="71" r="6" fill="#10b981" />

  <text x="156" y="76" fill="#94a3b8" font-family="monospace" font-size="14" font-weight="500">&gt;_ umut.dev / blog / ${escapeXml(slug.length > 35 ? slug.substring(0, 32) + '...' : slug)}</text>

  <rect x="970" y="58" width="150" height="26" rx="13" fill="rgba(168,85,247,0.15)" stroke="rgba(168,85,247,0.3)" stroke-width="1" />
  <text x="1045" y="75" fill="#c084fc" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">TECHNICAL ARTICLE</text>

  <foreignObject x="95" y="125" width="1010" height="380">
    <div xmlns="http://www.w3.org/1999/xhtml" style="height:100%;display:flex;flex-direction:column;justify-content:space-between;color:#f8fafc;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;">
      <div>
        <div style="display:inline-block;padding:6px 14px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:8px;font-family:monospace;font-size:13px;font-weight:600;color:#a5b4fc;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:18px;">
          📖 ${readingTime} min read • ${dateStr}
        </div>
        <h1 style="margin:0;font-size:46px;font-weight:900;line-height:1.2;letter-spacing:-0.03em;color:#ffffff;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">
          ${title}
        </h1>
        <div style="margin-top:24px;display:flex;flex-wrap:wrap;">
          ${tagsHtml}
        </div>
      </div>

      <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;display:flex;align-items:center;justify-content:space-between;font-size:15px;color:#94a3b8;font-family:monospace;">
        <div style="color:#c084fc;font-weight:600;">
          ⚡ umutpatlak.com/blog
        </div>
        <div>
          By <strong style="color:#f8fafc;">Umut Patlak</strong> • Full-Stack Developer
        </div>
      </div>
    </div>
  </foreignObject>
</svg>`;
  }

  generateGeneralBlogOgSvg(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1322" />
      <stop offset="100%" stop-color="#07090e" />
    </linearGradient>
    <radialGradient id="purpleGlow" cx="20%" cy="20%" r="50%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="cyanGlow" cx="80%" cy="80%" r="50%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="630" fill="url(#purpleGlow)" />
  <rect width="1200" height="630" fill="url(#cyanGlow)" />

  <rect x="50" y="45" width="1100" height="540" rx="20" fill="#0f1420" fill-opacity="0.88" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />

  <path d="M 50 65 Q 50 45 70 45 L 1130 45 Q 1150 45 1150 65 L 1150 97 L 50 97 Z" fill="#0a0e18" fill-opacity="0.95" />
  <line x1="50" y1="97" x2="1150" y2="97" stroke="rgba(255,255,255,0.08)" stroke-width="1" />

  <circle cx="80" cy="71" r="6" fill="#ef4444" />
  <circle cx="102" cy="71" r="6" fill="#eab308" />
  <circle cx="124" cy="71" r="6" fill="#10b981" />

  <text x="156" y="76" fill="#94a3b8" font-family="monospace" font-size="14" font-weight="500">&gt;_ umut.dev / blog ~ engineering &amp; architecture</text>

  <foreignObject x="95" y="130" width="1010" height="380">
    <div xmlns="http://www.w3.org/1999/xhtml" style="height:100%;display:flex;flex-direction:column;justify-content:space-between;color:#f8fafc;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;">
      <div>
        <div style="display:inline-block;padding:6px 14px;background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.3);border-radius:8px;font-family:monospace;font-size:13px;font-weight:600;color:#c084fc;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:18px;">
          ARTICLES &amp; ARCHITECTURE TUTORIALS
        </div>
        <h1 style="margin:0;font-size:48px;font-weight:900;line-height:1.15;letter-spacing:-0.03em;color:#ffffff;">
          Software Architecture &amp; Modern Web Insights
        </h1>
        <p style="font-size:20px;line-height:1.5;color:#94a3b8;margin-top:14px;">
          Deep dives into React, NestJS, TypeScript, microservices, database optimizations, and software craftsmanship.
        </p>
      </div>

      <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;display:flex;align-items:center;justify-content:space-between;font-size:15px;color:#94a3b8;font-family:monospace;">
        <div style="color:#c084fc;font-weight:600;">
          📖 umutpatlak.com/blog
        </div>
        <div>
          By <strong style="color:#f8fafc;">Umut Patlak</strong> • Full-Stack Developer
        </div>
      </div>
    </div>
  </foreignObject>
</svg>`;
  }
}

