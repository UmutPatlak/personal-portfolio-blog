import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE_TOKEN } from '../db/database.module';
import { type Database } from '../config/database';
import { personalInfo } from '../db/schema';
import type { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';

@Injectable()
export class PersonalInfoService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async get() {
    const [info] = await this.db.select().from(personalInfo).limit(1);
    if (!info) {
      // Create empty default if doesn't exist
      const [created] = await this.db
        .insert(personalInfo)
        .values({
          name: 'Umut Patlak',
          title: 'Full-Stack Developer',
          bio: '',
        })
        .returning();
      return created;
    }
    return info;
  }

  async update(dto: UpdatePersonalInfoDto) {
    const current = await this.get();

    const [updated] = await this.db
      .update(personalInfo)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(personalInfo.id, current.id))
      .returning();

    return updated;
  }
}
