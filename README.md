# 🚀 Umut Patlak — Personal Portfolio & Blog Platform

> Modern, full-stack personal portfolio, interactive CV, and dynamic Markdown blog platform engineered with **React 19**, **Vite**, **NestJS 11**, **PostgreSQL**, and **Drizzle ORM**.

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
- [📄 License](#-license)

---

## ✨ Features

### 🌟 Frontend (Portfolio & Client)
- **Hero & Interactive CV**: Dynamic personal presentation, experience timeline, technical skills radar, and downloadable CV.
- **Projects Showcase**: Filterable, responsive grid of featured projects with live demo and source code links.
- **Markdown Blog**: Rich blog reading experience with GFM markdown support, syntax highlighting for code snippets, estimated reading time, tag filters, and clean typography.
- **Dark Mode Aesthetic**: Sleek, modern dark-themed UI built with Tailwind CSS v4 and fluid micro-animations powered by Framer Motion.
- **Contact Form**: Direct messaging system integrated with the backend API.
- **Client-side Routing & SEO**: Fast client routing via React Router v7 with meta tags support.

### 🛡 Backend & Admin CMS
- **RESTful API Architecture**: Modular NestJS backend with global validation pipes and rate limiting (Throttler).
- **Secure Authentication**: JWT token-based authentication with Passport strategy, bcrypt password hashing, and route guards.
- **Admin Dashboard**:
  - Full CRUD operations for Blog Posts (Draft / Published states, tag management, custom slugs).
  - Project management (Featured flags, ordering, tech stack tags).
  - Contact inbox for incoming messages with read/unread tracking.
- **Type-Safe ORM**: Drizzle ORM integrated with PostgreSQL for migrations, relation queries, and schema management.
- **Database Seeding**: Automated initial admin account creation and mock data seeding.

---

## 🛠 Tech Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern UI library |
| **TypeScript** | Type safety across components |
| **Vite 6** | Next-generation frontend tooling |
| **Tailwind CSS v4** | Modern utility-first styling |
| **Framer Motion** | Declarative animations and transitions |
| **TanStack React Query v5** | Server state management and caching |
| **React Router v7** | Declarative client-side routing |
| **Lucide React** | Modern iconography |
| **React Markdown / GFM** | Markdown rendering with syntax highlighting |

### Backend
| Technology | Description |
| :--- | :--- |
| **NestJS 11** | Scalable enterprise Node.js framework |
| **TypeScript** | Strongly typed backend logic |
| **PostgreSQL 15+** | Relational database |
| **Drizzle ORM & Kit** | Type-safe TypeScript ORM & migration tool |
| **Passport & JWT** | Secure token-based authentication |
| **Bcrypt** | Password hashing |
| **Class Validator / Transformer** | Robust DTO validation |

---

## 📂 Project Structure

```bash
personal-portfolio-blog/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets & public files
│   ├── src/
│   │   ├── components/         # Reusable UI, Layout, Home & Blog components
│   │   │   ├── admin/          # Admin CMS management components
│   │   │   ├── blog/           # Blog post cards, search & reader components
│   │   │   ├── home/           # Hero, About, Skills, Projects, Contact sections
│   │   │   ├── layout/         # Navbar, Footer, Container layouts
│   │   │   └── ui/             # Buttons, Inputs, Modals, Cards
│   │   ├── hooks/              # Custom React hooks (useAuth, etc.)
│   │   ├── pages/              # Route pages (Home, Blog, PostDetail, Admin)
│   │   ├── services/           # Axios API client & endpoints
│   │   ├── types/              # Frontend TypeScript interfaces
│   │   ├── App.tsx             # Root application router
│   │   ├── index.css           # Design tokens & Tailwind styles
│   │   └── main.tsx            # Application entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts          # Vite configuration with API proxy
│
├── server/                     # Backend Application (NestJS)
│   ├── src/
│   │   ├── auth/               # JWT authentication, guards & strategies
│   │   ├── blog/               # Blog posts module, controller & service
│   │   ├── common/             # Interceptors, filters & decorators
│   │   ├── config/             # Environment configuration
│   │   ├── contact/            # Contact message handling module
│   │   ├── db/                 # Drizzle database schema & seed scripts
│   │   ├── projects/           # Projects module, controller & service
│   │   ├── app.module.ts       # Root NestJS application module
│   │   └── main.ts             # Server entry point (Port 3000)
│   ├── .env.example            # Backend environment template
│   ├── drizzle.config.ts       # Drizzle ORM configuration
│   ├── nest-cli.json
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore                  # Git ignore rules for node_modules, build & env
└── README.md                   # Project documentation
```

---

## 🗄 Database Schema

The database model is defined via Drizzle ORM:

- **`users`**: Administrator credentials and profile info (`id`, `email`, `passwordHash`, `name`, `createdAt`).
- **`posts`**: Markdown blog entries with publishing state (`id`, `title`, `slug`, `summary`, `content`, `coverImage`, `tags`, `status`, `readingTime`, `authorId`, `publishedAt`).
- **`projects`**: Portfolio projects catalog (`id`, `title`, `description`, `technologies`, `githubUrl`, `demoUrl`, `imageUrl`, `featured`, `order`).
- **`messages`**: Inbound contact submissions (`id`, `name`, `email`, `subject`, `message`, `isRead`, `createdAt`).

---

## 🔌 API Endpoints

### 🔐 Authentication
- `POST /api/auth/login` — Administrator login & JWT token retrieval
- `GET /api/auth/profile` — Get current authenticated user profile *(Protected)*

### 📝 Blog Posts
- `GET /api/blog` — List published blog posts (supports search & tag filters)
- `GET /api/blog/:slug` — Get post details by slug
- `GET /api/blog/admin/all` — List all posts including drafts *(Protected)*
- `POST /api/blog` — Create a new post *(Protected)*
- `PUT /api/blog/:id` — Update an existing post *(Protected)*
- `DELETE /api/blog/:id` — Delete a post *(Protected)*

### 💼 Projects
- `GET /api/projects` — List all projects
- `POST /api/projects` — Create a new project *(Protected)*
- `PUT /api/projects/:id` — Update project details *(Protected)*
- `DELETE /api/projects/:id` — Remove a project *(Protected)*

### 📬 Contact
- `POST /api/contact` — Submit a contact form message *(Public / Rate limited)*
- `GET /api/contact` — List received messages *(Protected)*
- `PATCH /api/contact/:id/read` — Mark message as read *(Protected)*
- `DELETE /api/contact/:id` — Delete message *(Protected)*

---

## ⚡ Getting Started

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v20.x or higher)
- [PostgreSQL](https://www.postgresql.org/) (v15.x or higher)
- [Git](https://git-scm.com/)

---

### 1. Clone Repository

```bash
git clone https://github.com/UmutPatlak/personal-portfolio-blog.git
cd personal-portfolio-blog
```

---

### 2. Backend Setup (NestJS + PostgreSQL)

1. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your PostgreSQL database credentials and JWT secret:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your_postgres_password
   DATABASE_NAME=umut_portfolio

   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRATION=7d

   ADMIN_EMAIL=umutpatlak77@gmail.com
   ADMIN_PASSWORD=your_secure_password
   ADMIN_NAME=Umut Patlak
   ```

4. Push the schema to PostgreSQL & seed initial admin user:
   ```bash
   npm run db:push
   npm run seed
   ```

5. Start the backend development server:
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
- **Admin Dashboard**: Accessible at `/admin` once logged in. Allows creating, editing, and publishing blog posts, managing projects, and viewing contact messages.

---

## 📜 Available Scripts

### Server (`/server`)
| Command | Description |
| :--- | :--- |
| `npm run start:dev` | Start NestJS in watch mode |
| `npm run build` | Build production server bundle |
| `npm run start:prod` | Run compiled production server |
| `npm run db:push` | Synchronize Drizzle schema with database |
| `npm run db:generate` | Generate database migrations |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:studio` | Launch Drizzle Studio Web GUI |
| `npm run seed` | Seed database with initial admin |

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
| `DATABASE_HOST` | PostgreSQL Host | `localhost` |
| `DATABASE_PORT` | PostgreSQL Port | `5432` |
| `DATABASE_USER` | PostgreSQL Username | `postgres` |
| `DATABASE_PASSWORD` | PostgreSQL Password | `password` |
| `DATABASE_NAME` | Database Name | `umut_portfolio` |
| `JWT_SECRET` | Secret key for signing JWTs | `random_secret_string` |
| `JWT_EXPIRATION` | Token validity duration | `7d` |
| `ADMIN_EMAIL` | Initial admin account email | `umutpatlak77@gmail.com` |
| `ADMIN_PASSWORD` | Initial admin account password | `secure_password` |
| `ADMIN_NAME` | Initial admin display name | `Umut Patlak` |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Developed with ❤️ by **[Umut Patlak](https://github.com/UmutPatlak)**
