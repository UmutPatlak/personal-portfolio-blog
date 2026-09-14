import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import {
  users,
  personalInfo,
  experiences,
  achievements,
  projects,
  skillCategories,
  skills,
  education,
  languages,
} from './schema';

dotenv.config();

async function seed() {
  const pool = process.env.DATABASE_URL
    ? new Pool({ connectionString: process.env.DATABASE_URL })
    : new Pool({
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'umut_portfolio',
    });

  const db = drizzle(pool);

  // 1. Admin User
  const email = process.env.ADMIN_EMAIL || 'umutpatlak77@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const name = process.env.ADMIN_NAME || 'Umut Patlak';

  const passwordHash = await bcrypt.hash(password, 12);
  await db
    .insert(users)
    .values({ email, passwordHash, name })
    .onConflictDoNothing({ target: users.email });
  console.log(`✅ Admin user checked/seeded: ${email}`);

  // 2. Personal Info (only if empty)
  const [personalInfoCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(personalInfo);
  if (Number(personalInfoCount.count) === 0) {
    await db.insert(personalInfo).values({
      name: 'Umut Patlak',
      title: 'Full-Stack Developer',
      bio: 'Full-stack developer with hands-on production experience contributing to a multi-tenant EV charging SaaS platform. Focused on shipping robust, end-to-end features and scalable full-stack solutions.',
      location: 'Istanbul, Turkey',
      email: 'umutpatlak77@gmail.com',
      phone: '+90 539 511 75 09',
      githubUrl: 'https://github.com/UmutPatlak',
      linkedinUrl: 'https://www.linkedin.com/in/umut-patlak-17508b254/',
      profileImage: null,
      cvUrl: '/umutcv.pdf',
    });
    console.log('✅ Personal info seeded');
  }

  // 3. Experiences & Achievements (only if empty)
  const [expCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(experiences);
  if (Number(expCount.count) === 0) {
    const [zebraExp] = await db
      .insert(experiences)
      .values({
        company: 'Zebra Elektronik',
        position: 'Full-Stack Developer',
        location: 'Istanbul, Turkey',
        startDate: 'Jan 2026',
        endDate: 'Aug 2026',
        description:
          'Contributed to two production Angular + Spring Boot platforms (EZCMP charge management & EZCSMS station management) serving 1,200+ EV charging stations across multiple operator tenants in Turkey. Worked in a cross-functional team of ~20 colleagues across engineering, product, and QA.',
        order: 0,
      })
      .returning();

    const zebraAchievements = [
      'Built an end-to-end manual transaction creation flow (Angular modal + Spring Boot service with CSMS integration, input sanitization, and gift balance validation) used by support agents to recover failed charging sessions.',
      'Designed and shipped an automatic transaction-timeout service that auto-closes and invalidates zero-energy charging sessions inactive for >24h, eliminating stale data in the customer-facing mobile app.',
      "Fixed a tenant-isolation bug exposing other users' RFID requests; resolved a discount-visibility regression where HOME/WORKPLACE EVSE discounts were missing on the mobile station endpoint.",
      'Made corporate-contract "tax office" and "company name" fields inline-editable across Angular UI, REST endpoint, and ContractService, including request DTO design and CORS configuration.',
      'Shipped the "Invalid Transactions" filter end-to-end (UI control, query parameter, backend predicate, EN/TR i18n) and replaced a brittle 1-day export window with a 1000-record cap.',
      'Hardened production code with multiple NPE / HTTP 500 fixes and implemented SOC-80% push notification logic with duplicate prevention.',
      "Enhanced finance team's first-debt Excel report with account code, balance, phone number, and first-debt date columns; reduced SMS resend cooldowns from 3 min to 60s after UX feedback.",
    ];

    for (let i = 0; i < zebraAchievements.length; i++) {
      await db.insert(achievements).values({
        experienceId: zebraExp.id,
        content: zebraAchievements[i],
        order: i,
      });
    }
    console.log('✅ Experiences & achievements seeded');
  }

  // 4. Projects (only if empty)
  const [projectCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(projects);
  if (Number(projectCount.count) === 0) {
    await db.insert(projects).values([
      {
        title: 'OCPP Gateway Admin Panel',
        type: 'Solo Full-Stack Project',
        technologies: [
          'React',
          'Vite',
          'TypeScript',
          'Tailwind CSS',
          'react-router',
          'react-i18next',
          'NestJS',
          'Drizzle ORM',
          'PostgreSQL',
        ],
        description:
          'A white-label admin console for an OCPP gateway product — operators see every station that ever connects, manage tenants and API keys, approve connections, and run gateway-level configuration.',
        featured: true,
        order: 0,
        architecture:
          'Implemented a mock-first API architecture: a single GatewayApi TypeScript interface backed by both mockApi.ts and realApi.ts, catching drift at compile time.',
        challenges: [
          'Real-time station/event streaming over Server-Sent Events',
          'Strict tenant-isolation across multi-operator gateway',
        ],
        solutions: [
          'Unified subscription handler that works identically in mock and real modes',
          'Permission-gated routes, route-level error boundaries, and EN/TR i18n',
        ],
      },
      {
        title: 'GitHub Repository Monitor Service',
        type: 'Backend Service & Distributed Systems',
        technologies: [
          'Java 21',
          'Spring Boot 3.4',
          'PostgreSQL 15',
          'Docker Compose',
          'Spring Data JPA',
          'WebClient',
          'MapStruct',
          'Jakarta Validation',
        ],
        description:
          'A resilient Spring Boot service that continuously monitors designated GitHub repositories in real-time, stores analytical metadata in PostgreSQL, and provides a robust REST API for repository management.',
        githubUrl: 'https://github.com/UmutPatlak/Github-Monitor-Service',
        featured: true,
        order: 1,
        architecture: 'Concurrency & Optimistic Locking with @Version and reactive Spring WebClient for non-blocking communication with GitHub REST API.',
        challenges: ['Concurrent synchronization race conditions', 'GitHub API rate limits'],
        solutions: ['Optimistic locking with @Version', 'Non-blocking WebClient with retry backoff'],
      },
      {
        title: 'Personal Portfolio & Blog Platform',
        type: 'Solo Full-Stack Project',
        technologies: [
          'React',
          'Vite',
          'TypeScript',
          'Tailwind CSS',
          'NestJS',
          'Drizzle ORM',
          'PostgreSQL',
          'Docker',
          'react-i18next',
        ],
        description:
          'A production-grade personal developer portfolio and content management blog platform with real-time responsive UI, bilingual support (EN/TR), dark/light theme, and dynamic CMS capabilities.',
        githubUrl: 'https://github.com/UmutPatlak/personal-portfolio-blog',
        featured: true,
        order: 2,
        architecture: 'Modular NestJS backend, Drizzle ORM type-safe SQL queries, PostgreSQL, and React + Tailwind CSS v4.',
        challenges: ['Zero downtime content updates', 'Safe multi-language state management'],
        solutions: ['Full CMS admin panel with safe database migrations', 'react-i18next with persistent storage'],
      },
    ]);
    console.log('✅ Projects seeded');
  }

  // 5. Skills & Categories (only if empty)
  const [skillCatCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(skillCategories);
  if (Number(skillCatCount.count) === 0) {
    const rawCategories = [
      {
        name: 'Languages',
        icon: 'Code2',
        skills: ['TypeScript', 'JavaScript', 'Java', 'SQL', 'HTML', 'CSS'],
      },
      {
        name: 'Frontend',
        icon: 'Layout',
        skills: ['React', 'Angular', 'Tailwind CSS', 'Vite', 'react-router', 'react-i18next'],
      },
      {
        name: 'Backend',
        icon: 'Server',
        skills: ['Node.js', 'NestJS', 'Spring Boot', 'Spring Security', 'JWT', 'Hibernate / JPA', 'Drizzle ORM', 'jOOQ'],
      },
      {
        name: 'Database',
        icon: 'Database',
        skills: ['PostgreSQL', 'MySQL'],
      },
      {
        name: 'Tools & CI/CD',
        icon: 'Wrench',
        skills: ['Git', 'Bitbucket Pipelines', 'Jira', 'Flyway', 'Maven', 'npm', 'Postman'],
      },
      {
        name: 'AI & Productivity',
        icon: 'Sparkles',
        skills: ['Cursor', 'Claude', 'Claude Code', 'AI-Assisted Development'],
      },
      {
        name: 'Concepts',
        icon: 'BookOpen',
        skills: ['REST APIs', 'Server-Sent Events', 'OCPP Protocol', 'Multi-tenant SaaS', 'CI/CD'],
      },
    ];

    for (let c = 0; c < rawCategories.length; c++) {
      const cat = rawCategories[c];
      const [insertedCat] = await db
        .insert(skillCategories)
        .values({
          name: cat.name,
          icon: cat.icon,
          order: c,
        })
        .returning();

      for (let s = 0; s < cat.skills.length; s++) {
        await db.insert(skills).values({
          categoryId: insertedCat.id,
          name: cat.skills[s],
          order: s,
        });
      }
    }
    console.log('✅ Skills and categories seeded');
  }

  // 6. Education & Languages (only if empty)
  const [eduCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(education);
  if (Number(eduCount.count) === 0) {
    await db.insert(education).values({
      school: 'Okan University',
      department: 'Information Systems and Technologies',
      degree: 'B.Sc.',
      startDate: '2022',
      endDate: '2026',
      order: 0,
    });
    console.log('✅ Education seeded');
  }

  const [langCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(languages);
  if (Number(langCount.count) === 0) {
    await db.insert(languages).values([
      { name: 'English', level: 'Professional working proficiency', order: 0 },
      { name: 'Turkish', level: 'Native', order: 1 },
    ]);
    console.log('✅ Languages seeded');
  }

  await pool.end();
  console.log('✨ All initial seed checks completed.');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
