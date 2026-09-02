export const personalInfo = {
  name: 'Umut Patlak',
  title: 'Full-Stack Developer',
  email: 'umutpatlak77@gmail.com',
  phone: '+90 539 511 75 09',
  location: 'Istanbul, Turkey',
  bio: 'Full-stack developer with hands-on production experience contributing to a multi-tenant EV charging SaaS platform. Focused on shipping robust, end-to-end features and scalable full-stack solutions.',
  github: 'https://github.com/UmutPatlak',
  linkedin: 'https://linkedin.com/in/umutpatlak',
  cvFileName: 'umutcv.pdf',
};

export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
}

export const experiences: ExperienceItem[] = [
  {
    company: 'Zebra Elektronik',
    role: 'Full-Stack Developer',
    location: 'Istanbul, Turkey',
    period: 'Jan 2026 – Aug 2026',
    description:
      'Contributed to two production Angular + Spring Boot platforms (EZCMP charge management & EZCSMS station management) serving 1,200+ EV charging stations across multiple operator tenants in Turkey. Worked in a cross-functional team of ~20 colleagues across engineering, product, and QA.',
    achievements: [
      'Built an end-to-end manual transaction creation flow (Angular modal + Spring Boot service with CSMS integration, input sanitization, and gift balance validation) used by support agents to recover failed charging sessions.',
      'Designed and shipped an automatic transaction-timeout service that auto-closes and invalidates zero-energy charging sessions inactive for >24h, eliminating stale data in the customer-facing mobile app.',
      'Fixed a tenant-isolation bug exposing other users\' RFID requests; resolved a discount-visibility regression where HOME/WORKPLACE EVSE discounts were missing on the mobile station endpoint.',
      'Made corporate-contract "tax office" and "company name" fields inline-editable across Angular UI, REST endpoint, and ContractService, including request DTO design and CORS configuration.',
      'Shipped the "Invalid Transactions" filter end-to-end (UI control, query parameter, backend predicate, EN/TR i18n) and replaced a brittle 1-day export window with a 1000-record cap.',
      'Hardened production code with multiple NPE / HTTP 500 fixes and implemented SOC-80% push notification logic with duplicate prevention.',
      'Enhanced finance team\'s first-debt Excel report with account code, balance, phone number, and first-debt date columns; reduced SMS resend cooldowns from 3 min to 60s after UX feedback.',
    ],
  },
];

export interface ProjectItem {
  title: string;
  type: string;
  stack: string[];
  description: string;
  highlights: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export const projects: ProjectItem[] = [
  {
    title: 'OCPP Gateway Admin Panel',
    type: 'Solo Full-Stack Project',
    stack: [
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
    highlights: [
      'Implemented a mock-first API architecture: a single GatewayApi TypeScript interface backed by both mockApi.ts and realApi.ts, catching drift at compile time.',
      'Real-time station/event streaming over Server-Sent Events with a unified subscription handler that works identically in mock and real modes.',
      'Auth designed around JWT + in-memory token store mirrored to sessionStorage (narrower XSS surface) with centralized gateway:unauthorized event for forced logout.',
      'Modeled 70+ REST endpoints across tenant management, station registration, OCPP admin commands, configuration mappings, command history, and authentication.',
      'Added permission-gated routes, route-level error boundaries, and EN/TR i18n.',
    ],
  },
];

export interface SkillCategory {
  name: string;
  icon: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'Languages',
    icon: 'Code2',
    skills: ['TypeScript', 'JavaScript', 'Java', 'SQL', 'HTML', 'CSS'],
  },
  {
    name: 'Frontend',
    icon: 'Layout',
    skills: [
      'React',
      'Angular',
      'Tailwind CSS',
      'Vite',
      'react-router',
      'react-i18next',
    ],
  },
  {
    name: 'Backend',
    icon: 'Server',
    skills: [
      'Node.js',
      'NestJS',
      'Spring Boot',
      'Spring Security',
      'JWT',
      'Hibernate / JPA',
      'Drizzle ORM',
      'jOOQ',
    ],
  },
  {
    name: 'Database',
    icon: 'Database',
    skills: ['PostgreSQL', 'MySQL'],
  },
  {
    name: 'Tools & CI/CD',
    icon: 'Wrench',
    skills: [
      'Git',
      'Bitbucket Pipelines',
      'Jira',
      'Flyway',
      'Maven',
      'npm',
      'Postman',
    ],
  },
  {
    name: 'AI & Productivity',
    icon: 'Sparkles',
    skills: ['Cursor', 'Claude', 'Claude Code', 'AI-Assisted Development'],
  },
  {
    name: 'Concepts',
    icon: 'BookOpen',
    skills: [
      'REST APIs',
      'Server-Sent Events',
      'OCPP Protocol',
      'Multi-tenant SaaS',
      'CI/CD',
    ],
  },
];

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
}

export const education: EducationItem[] = [
  {
    institution: 'Okan University',
    degree: 'B.Sc.',
    field: 'Information Systems and Technologies',
  },
];

export interface LanguageItem {
  language: string;
  proficiency: string;
}

export const languages: LanguageItem[] = [
  { language: 'English', proficiency: 'Professional working proficiency' },
  { language: 'Turkish', proficiency: 'Native' },
];
