import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc, and, ilike, arrayContains, sql } from 'drizzle-orm';
import { DATABASE_TOKEN } from '../db/database.module';
import { type Database } from '../config/database';
import { posts } from '../db/schema';
import type { CreatePostDto } from './dto/create-post.dto';
import type { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class BlogService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) { }

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
        .orderBy(desc(posts.publishedAt))
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
}
