# 🚀 Umut Patlak — Personal Portfolio & Blog Platform

> Modern, full-stack personal portfolio with interactive 3D visuals, dynamic resume management, Markdown blog engine, and admin CMS — built with **React 19**, **Vite 6**, **NestJS 11**, **PostgreSQL 16**, and **Drizzle ORM**.

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🗄 Database Schema](#-database-schema)
- [🔌 API Endpoints](#-api-endpoints)
- [⚡ Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup (NestJS + PostgreSQL)](#2-backend-setup-nestjs--postgresql)
  - [3. Frontend Setup (React + Vite)](#3-frontend-setup-react--vite)
- [🔐 Admin Panel & Authentication](#-admin-panel--authentication)
- [📜 Available Scripts](#-available-scripts)
- [🛡 Environment Variables](#-environment-variables)
- [🌐 Deployment](#-deployment)
- [📄 License](#-license)

---

## ✨ Features

### 🌟 Frontend (Portfolio & Client)
- **3D Interactive Hero**: Animated Three.js background with particle effects and dynamic intro animation.
- **Dynamic Resume Page**: Full interactive CV with experience timeline, education history, skills radar, and downloadable PDF — all data fetched from the backend API.
- **Projects Showcase**: Filterable, responsive grid of featured projects with live demo links, source code links, and dedicated project detail pages (case study support with architecture, challenges, solutions).
- **Markdown Blog**: Rich blog reading experience with GFM markdown support, syntax highlighting for code snippets, estimated reading time, tag filters, and clean typography.
- **Dark/Light Mode**: Theme toggle with persistent preference, sleek UI built with Tailwind CSS v4 and fluid micro-animations powered by Framer Motion.
- **Multi-Language Support (i18n)**: Full Turkish & English localization via react-i18next with language toggle.
- **SEO Optimized**: react-helmet-async meta tag management, server-generated sitemap.xml, structured heading hierarchy.
- **Contact Form**: Direct messaging system with backend integration and toast notifications (react-hot-toast).
- **Client-side Routing**: Fast navigation via React Router v7 with lazy loading, code splitting, error boundaries, and animated page transitions.
- **GitHub Activity**: Live GitHub contribution activity widget on the home page.

### 🛡 Backend & Admin CMS
- **RESTful API Architecture**: Modular NestJS backend with global validation pipes, rate limiting (Throttler), and security headers (Helmet).
- **Secure Authentication**: JWT token-based authentication with Passport strategy, bcrypt password hashing, and route guards.
- **Admin Dashboard** (7 management tabs):
  - **Blog**: Full CRUD for posts (Draft / Published states, tag management, custom slugs, cover images).
  - **Projects**: Project management with featured flags, ordering, tech stack tags, case study fields (architecture, challenges, solutions).
  - **Experience**: Work experience management with achievements, ordering, and date ranges.
  - **Skills**: Skill categories and individual skills management with drag-and-drop reordering.
  - **Education**: Education records and language proficiency management.
  - **Profile**: Personal info management (name, title, bio, social links, profile image, CV upload).
  - **Inbox**: Contact message inbox with read/unread tracking and deletion.
- **File Upload**: Image and document upload with size limits (5MB images, 15MB documents) stored in `/uploads`.
- **Health Check**: `/health` endpoint for monitoring database connectivity.
- **Sitemap**: Auto-generated `/sitemap.xml` for SEO.
- **Type-Safe ORM**: Drizzle ORM integrated with PostgreSQL for schema push, migrations, relation queries.
- **Database Seeding**: Automated initial admin account, experiences, skills, education, and personal info seeding.
- **Unit Tests**: Jest-based test suite covering all services with mock database layer.

---

## 🛠 Tech Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern UI library with lazy loading & Suspense |
| **TypeScript ~5.7** | Type safety across all components |
| **Vite 6** | Next-generation frontend tooling |
| **Tailwind CSS v4** | Utility-first styling via `@tailwindcss/vite` plugin |
| **Framer Motion 11** | Declarative animations and page transitions |
| **Three.js** | 3D interactive background effects |
| **TanStack React Query v5** | Server state management and caching |
| **React Router v7** | Declarative client-side routing with code splitting |
| **react-i18next + i18next** | Multi-language support (TR/EN) |
| **react-helmet-async** | SEO meta tag management |
| **react-hot-toast** | Toast notification system |
| **Lucide React** | Modern iconography |
| **React Markdown / GFM** | Markdown rendering with syntax highlighting |
| **Axios** | HTTP client for API communication |

### Backend
| Technology | Description |
| :--- | :--- |
| **NestJS 11** | Scalable enterprise Node.js framework |
| **TypeScript ~5.7** | Strongly typed backend logic |
| **PostgreSQL 16** | Relational database (Docker Alpine) |
| **Drizzle ORM & Kit** | Type-safe TypeScript ORM & migration tool |
| **Passport & JWT** | Secure token-based authentication |
| **Bcrypt** | Password hashing |
| **Helmet** | HTTP security headers |
| **Class Validator / Transformer** | Robust DTO validation |
| **Multer** | File upload handling (memory storage) |
| **Jest** | Unit testing framework |

---

## 📂 Project Structure

```bash
personal-portfolio-blog/
├── client/                          # Frontend Application (React + Vite)
│   ├── public/                     # Static assets & public files
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/              # Admin CMS tabs: Blog, Projects, Experience,
│   │   │   │                         Skills, Education, Profile, Inbox, ProtectedRoute
│   │   │   ├── blog/               # BlogCard
│   │   │   ├── home/               # Hero, About, Skills, Experience, Education,
│   │   │   │                         Projects, Contact, GitHubActivity
│   │   │   ├── layout/             # Navbar, Footer, Layout
│   │   │   ├── seo/                # SEO component (react-helmet-async)
│   │   │   └── ui/                 # Background3D, IntroAnimation, ErrorBoundary,
│   │   │                             Badge, Button, Card, ConfirmDialog, Container,
│   │   │                             Input, Textarea, SectionHeading, ScrollReveal,
│   │   │                             SkeletonCard, SkeletonSection, ThemeToggle,
│   │   │                             LanguageToggle
│   │   ├── data/                   # Static data (blog-data.ts, cv-data.ts)
│   │   ├── hooks/                  # useAuth, useScrollAnimation, useTheme
│   │   ├── i18n/
│   │   │   ├── i18n.ts            # i18next configuration
│   │   │   └── locales/           # en.json, tr.json
│   │   ├── lib/                    # Utility functions (utils.ts)
│   │   ├── pages/                  # HomePage, ResumePage, BlogPage, BlogPostPage,
│   │   │                            ProjectDetailPage, AdminLoginPage,
│   │   │                            AdminDashboardPage, AdminPostEditorPage,
│   │   │                            NotFoundPage
│   │   ├── services/               # api.ts (axios), authService, blogService,
│   │   │                            contactService, projectService, experienceService,
│   │   │                            skillService, educationService,
│   │   │                            personalInfoService, uploadService
│   │   ├── types/                  # TypeScript interfaces (user, post, project,
│   │   │                            contact, experience, skill, education, personalInfo)
│   │   ├── App.tsx                 # Root application router (lazy loading)
│   │   ├── index.css               # Design tokens & Tailwind styles
│   │   └── main.tsx                # Application entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts              # Vite config: API proxy, path alias (@/)
│
├── server/                          # Backend Application (NestJS)
│   ├── src/
│   │   ├── auth/                   # JWT authentication, guards & strategies
│   │   ├── blog/                   # Blog posts CRUD (draft/published, slug, tags)
│   │   ├── projects/               # Projects CRUD (featured, ordering, case study)
│   │   ├── experiences/            # Work experiences CRUD with achievements
│   │   ├── skills/                 # Skill categories & skills CRUD with reordering
│   │   ├── education/              # Education & languages CRUD
│   │   ├── personal-info/          # Personal info (get/update)
│   │   ├── contact/                # Contact message handling module
│   │   ├── upload/                 # File upload (image & document)
│   │   ├── health/                 # Health check endpoint
│   │   ├── sitemap/                # Dynamic sitemap.xml generation
│   │   ├── common/                 # Interceptors, filters & decorators
│   │   ├── config/                 # Environment configuration
│   │   ├── db/
│   │   │   ├── schema.ts          # Drizzle schema (10 tables)
│   │   │   ├── database.module.ts # DB connection module
│   │   │   └── seed.ts            # Admin + sample data seeding
│   │   ├── app.module.ts          # Root NestJS application module
│   │   └── main.ts                # Server entry point (CORS, Helmet, Validation)
│   ├── uploads/                    # Uploaded files directory
│   ├── drizzle/                    # Migration files
│   ├── coverage/                   # Jest test coverage reports
│   ├── .env.example                # Backend environment template
│   ├── drizzle.config.ts           # Drizzle ORM configuration
│   ├── jest.config.ts              # Jest test configuration
│   ├── nest-cli.json
│   ├── package.json
│   └── tsconfig.json
│
├── scripts/                         # Utility scripts (generate-assets.mjs)
├── docker-compose.yml               # PostgreSQL 16-alpine container
├── .gitignore                       # Git ignore rules
├── CLAUDE.md                        # AI coding assistant context file
└── README.md                        # Project documentation
```

---

## 🗄 Database Schema

The database model is defined via Drizzle ORM with **10 tables**:

| Table | Description | Key Columns |
| :--- | :--- | :--- |
| **`users`** | Admin credentials | `id`, `email` (unique), `passwordHash`, `name`, `createdAt` |
| **`posts`** | Blog entries | `id`, `title`, `slug` (unique), `summary`, `content`, `coverImage`, `tags[]`, `status` (draft/published enum), `readingTime`, `authorId` (FK→users), `publishedAt` |
| **`projects`** | Portfolio projects | `id`, `title`, `type`, `description`, `technologies[]`, `githubUrl`, `demoUrl`, `imageUrl`, `featured`, `order`, `architecture`, `challenges[]`, `solutions[]` |
| **`experiences`** | Work experience | `id`, `company`, `position`, `location`, `startDate`, `endDate`, `description`, `order` |
| **`achievements`** | Experience achievements | `id`, `experienceId` (FK→experiences), `content`, `order` |
| **`skill_categories`** | Skill groupings | `id`, `name`, `icon`, `order` |
| **`skills`** | Individual skills | `id`, `categoryId` (FK→skill_categories), `name`, `order` |
| **`education`** | Education records | `id`, `school`, `department`, `degree`, `startDate`, `endDate`, `order` |
| **`languages`** | Language proficiency | `id`, `name`, `level`, `order` |
| **`personal_info`** | Profile information | `id`, `name`, `title`, `bio`, `location`, `email`, `phone`, `githubUrl`, `linkedinUrl`, `profileImage`, `cvUrl` |
| **`messages`** | Contact submissions | `id`, `name`, `email`, `subject`, `message`, `isRead`, `createdAt` |

**Relations:**
- `users` 1:N `posts` (cascade delete)
- `experiences` 1:N `achievements` (cascade delete)
- `skill_categories` 1:N `skills` (cascade delete)

---

## 🔌 API Endpoints

All endpoints operate under the `/api` prefix (except `/health` and `/sitemap.xml`).

### 🔐 Authentication
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | ❌ | JWT token retrieval |
| `GET` | `/api/auth/profile` | ✅ | Current authenticated user profile |

### 📝 Blog Posts
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/blog` | ❌ | List published posts (search & tag filters) |
| `GET` | `/api/blog/:slug` | ❌ | Get post by slug |
| `GET` | `/api/blog/admin/all` | ✅ | List all posts including drafts |
| `POST` | `/api/blog` | ✅ | Create a new post |
| `PUT` | `/api/blog/:id` | ✅ | Update an existing post |
| `DELETE` | `/api/blog/:id` | ✅ | Delete a post |

### 💼 Projects
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | ❌ | List all projects |
| `POST` | `/api/projects` | ✅ | Create a new project |
| `PUT` | `/api/projects/:id` | ✅ | Update project details |
| `DELETE` | `/api/projects/:id` | ✅ | Remove a project |

### 🧑‍💼 Experiences
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/experiences` | ❌ | List all experiences with achievements |
| `GET` | `/api/experiences/:id` | ❌ | Get single experience |
| `POST` | `/api/experiences` | ✅ | Create experience |
| `PATCH` | `/api/experiences/reorder` | ✅ | Reorder experiences |
| `PATCH` | `/api/experiences/:id` | ✅ | Update experience |
| `DELETE` | `/api/experiences/:id` | ✅ | Delete experience |

### 🎯 Skills
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | ❌ | List all skill categories with skills |
| `POST` | `/api/skills/categories` | ✅ | Create skill category |
| `PATCH` | `/api/skills/categories/reorder` | ✅ | Reorder categories |
| `PATCH` | `/api/skills/categories/:id` | ✅ | Update category |
| `DELETE` | `/api/skills/categories/:id` | ✅ | Delete category |
| `POST` | `/api/skills` | ✅ | Add a skill |
| `PATCH` | `/api/skills/reorder` | ✅ | Reorder skills |
| `PATCH` | `/api/skills/:id` | ✅ | Update a skill |
| `DELETE` | `/api/skills/:id` | ✅ | Delete a skill |

### 🎓 Education
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/education` | ❌ | List education & languages |
| `POST` | `/api/education` | ✅ | Create education record |
| `PATCH` | `/api/education/:id` | ✅ | Update education record |
| `DELETE` | `/api/education/:id` | ✅ | Delete education record |
| `POST` | `/api/education/languages` | ✅ | Add language |
| `PATCH` | `/api/education/languages/:id` | ✅ | Update language |
| `DELETE` | `/api/education/languages/:id` | ✅ | Delete language |

### 👤 Personal Info
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/personal-info` | ❌ | Get personal info |
| `PATCH` | `/api/personal-info` | ✅ | Update personal info |
| `PUT` | `/api/personal-info` | ✅ | Update personal info (full) |

### 📬 Contact
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | ❌ | Submit a contact message *(Rate limited)* |
| `GET` | `/api/contact` | ✅ | List received messages |
| `PATCH` | `/api/contact/:id/read` | ✅ | Mark message as read |
| `DELETE` | `/api/contact/:id` | ✅ | Delete message |

### 📤 Upload
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload/image` | ✅ | Upload image (max 5MB) |
| `POST` | `/api/upload/document` | ✅ | Upload document (max 15MB) |

### 🔧 Infrastructure (No `/api` prefix)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | ❌ | Health check (DB connectivity) |
| `GET` | `/sitemap.xml` | ❌ | Auto-generated XML sitemap |

---

## ⚡ Getting Started

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v20.x or higher)
- [Docker Desktop](https://www.docker.com/) (Recommended for PostgreSQL) or [PostgreSQL](https://www.postgresql.org/) (v16.x or higher)
- [Git](https://git-scm.com/)

---

### 1. Clone Repository

```bash
git clone https://github.com/UmutPatlak/personal-portfolio-blog.git
cd personal-portfolio-blog
```

---

### 2. Backend Setup (NestJS + PostgreSQL)

1. **Start PostgreSQL with Docker (Easiest)**:
   ```bash
   docker compose up -d
   ```
   *(Or make sure your local PostgreSQL service is running)*

2. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```

3. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials:
   ```env
   # Database
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=umut_portfolio

   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars
   JWT_EXPIRATION=7d

   # Admin Seed
   ADMIN_EMAIL=umutpatlak77@gmail.com
   ADMIN_PASSWORD=your_secure_password
   ADMIN_NAME=Umut Patlak
   ```

5. Push the schema to PostgreSQL & seed initial data:
   ```bash
   npm run db:push
   npm run seed
   ```

6. Start the backend development server:
   ```bash
   npm run start:dev
   ```
   > 🚀 Backend will run at: `http://localhost:3000` (API base: `http://localhost:3000/api`)

---

### 3. Frontend Setup (React + Vite)

1. Open a new terminal, navigate to the client folder and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   > 🌐 Frontend will run at: `http://localhost:5173`

---

## 🔐 Admin Panel & Authentication

- **Admin Login Route**: Navigate to `/admin/login` on the frontend.
- **Default Credentials**: Specified in your `server/.env` file during the `npm run seed` command.
- **Admin Dashboard**: Accessible at `/admin/dashboard` once logged in.
  - 📝 **Blog Tab**: Create, edit, and publish blog posts with markdown editor.
  - 💼 **Projects Tab**: Manage projects with case study details, tech stack, and featured flags.
  - 🧑‍💼 **Experience Tab**: Add/edit work experience entries with achievements.
  - 🎯 **Skills Tab**: Manage skill categories and individual skills with ordering.
  - 🎓 **Education Tab**: Manage education history and language proficiency.
  - 👤 **Profile Tab**: Update personal information, social links, profile image, and CV.
  - 📬 **Inbox Tab**: View and manage contact form submissions.

---

## 📜 Available Scripts

### Server (`/server`)
| Command | Description |
| :--- | :--- |
| `npm run start:dev` | Start NestJS in watch mode |
| `npm run dev` | Alias for start:dev (watch mode) |
| `npm run build` | Build production server bundle |
| `npm run start:prod` | Run compiled production server |
| `npm run db:push` | Synchronize Drizzle schema with database |
| `npm run db:generate` | Generate database migrations |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:studio` | Launch Drizzle Studio Web GUI |
| `npm run seed` | Seed database with initial admin & sample data |
| `npm run test` | Run Jest unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage report |

### Client (`/client`)
| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Type-check and build production bundle |
| `npm run preview` | Locally preview production build |
| `npm run lint` | Run ESLint validation |

---

## 🛡 Environment Variables

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `production` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | — |
| `FRONTEND_URL` | Frontend URL (e.g. Vercel) | — |
| `DATABASE_HOST` | PostgreSQL Host | `localhost` |
| `DATABASE_PORT` | PostgreSQL Port | `5432` |
| `DATABASE_USER` | PostgreSQL Username | `postgres` |
| `DATABASE_PASSWORD` | PostgreSQL Password | `password` |
| `DATABASE_NAME` | Database Name | `umut_portfolio` |
| `DATABASE_SSL` | Enable SSL for DB connection | `false` |
| `JWT_SECRET` | Secret key for signing JWTs (min 32 chars) | — |
| `JWT_EXPIRATION` | Token validity duration | `7d` |
| `ADMIN_EMAIL` | Initial admin account email | `umutpatlak77@gmail.com` |
| `ADMIN_PASSWORD` | Initial admin account password | — |
| `ADMIN_NAME` | Initial admin display name | `Umut Patlak` |

---

## 🌐 Deployment

- **Backend**: Deploy to [Railway](https://railway.app/) or any Node.js host. Railway auto-sets `PORT` and provides PostgreSQL with `DATABASE_URL`.
- **Frontend**: Deploy to [Vercel](https://vercel.com/) — Vercel preview URLs (`*.vercel.app`) are automatically allowed by CORS.
- **Production CORS**: Set `CORS_ORIGINS` and/or `FRONTEND_URL` environment variables. Subdomains of `umutpatlak.com` are also auto-allowed.
- **Reverse Proxy**: In production, configure Nginx or similar to proxy `/api` requests to the backend.
- **File Uploads**: The `/uploads` directory is served statically. Configure persistent storage in cloud environments.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Developed with ❤️ by **[Umut Patlak](https://github.com/UmutPatlak)**
