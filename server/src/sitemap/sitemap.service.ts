import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_TOKEN } from '../db/database.module';
import { posts, projects } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SitemapService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: any) {}

  async getSitemapData() {
    const publishedPosts = await this.db.select().from(posts).where(eq(posts.status, 'published'));
    const allProjects = await this.db.select().from(projects);
    return { publishedPosts, allProjects };
  }
}
