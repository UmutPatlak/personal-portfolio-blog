import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Enums ─────────────────────────────────────────────
export const postStatusEnum = pgEnum('post_status', ['draft', 'published']);

// ─── Users ─────────────────────────────────────────────
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Posts (Blog) ──────────────────────────────────────
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  tags: text('tags').array().notNull().default([]),
  status: postStatusEnum('status').notNull().default('draft'),
  readingTime: integer('reading_time').notNull().default(1),
  authorId: integer('author_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Projects ──────────────────────────────────────────
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }),
  description: text('description').notNull(),
  technologies: text('technologies').array().notNull().default([]),
  githubUrl: text('github_url'),
  demoUrl: text('demo_url'),
  imageUrl: text('image_url'),
  featured: boolean('featured').notNull().default(false),
  order: integer('order').notNull().default(0),
  // Case Study fields
  architecture: text('architecture'),
  challenges: text('challenges').array(),
  solutions: text('solutions').array(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Experiences ──────────────────────────────────────
export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  company: varchar('company', { length: 255 }).notNull(),
  position: varchar('position', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  startDate: varchar('start_date', { length: 100 }).notNull(),
  endDate: varchar('end_date', { length: 100 }), // null means "Present"
  description: text('description'),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  experienceId: integer('experience_id')
    .references(() => experiences.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content').notNull(),
  order: integer('order').notNull().default(0),
});

// ─── Skills ───────────────────────────────────────────
export const skillCategories = pgTable('skill_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  icon: varchar('icon', { length: 100 }),
  order: integer('order').notNull().default(0),
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id')
    .references(() => skillCategories.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  order: integer('order').notNull().default(0),
});

// ─── Education ────────────────────────────────────────
export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  school: varchar('school', { length: 255 }).notNull(),
  department: varchar('department', { length: 255 }).notNull(),
  degree: varchar('degree', { length: 255 }).notNull(),
  startDate: varchar('start_date', { length: 100 }),
  endDate: varchar('end_date', { length: 100 }),
  order: integer('order').notNull().default(0),
});

export const languages = pgTable('languages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  level: varchar('level', { length: 100 }).notNull(),
  order: integer('order').notNull().default(0),
});

// ─── Personal Info ────────────────────────────────────
export const personalInfo = pgTable('personal_info', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  bio: text('bio').notNull(),
  location: varchar('location', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  githubUrl: text('github_url'),
  linkedinUrl: text('linkedin_url'),
  profileImage: text('profile_image'),
  cvUrl: text('cv_url'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Messages (Contact Form) ──────────────────────────
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Relations ─────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

export const experiencesRelations = relations(experiences, ({ many }) => ({
  achievements: many(achievements),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  experience: one(experiences, {
    fields: [achievements.experienceId],
    references: [experiences.id],
  }),
}));

export const skillCategoriesRelations = relations(skillCategories, ({ many }) => ({
  skills: many(skills),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  category: one(skillCategories, {
    fields: [skills.categoryId],
    references: [skillCategories.id],
  }),
}));

// ─── Type Exports ──────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;
export type SkillCategory = typeof skillCategories.$inferSelect;
export type NewSkillCategory = typeof skillCategories.$inferInsert;
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;
export type Language = typeof languages.$inferSelect;
export type NewLanguage = typeof languages.$inferInsert;
export type PersonalInfo = typeof personalInfo.$inferSelect;
export type NewPersonalInfo = typeof personalInfo.$inferInsert;
