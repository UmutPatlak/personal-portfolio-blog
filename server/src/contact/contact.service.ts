import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DATABASE_TOKEN } from '../db/database.module';
import { type Database } from '../config/database';
import { messages } from '../db/schema';
import type { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ContactService {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async create(dto: CreateMessageDto) {
    await this.db.insert(messages).values({
      name: dto.name,
      email: dto.email,
      subject: dto.subject,
      message: dto.message,
    });

    return { message: 'Message sent successfully' };
  }

  async findAll() {
    return this.db
      .select()
      .from(messages)
      .orderBy(desc(messages.createdAt));
  }

  async markAsRead(id: number) {
    const [msg] = await this.db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();

    if (!msg) {
      throw new NotFoundException('Message not found');
    }

    return msg;
  }
}
