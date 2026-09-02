# CLAUDE.md — Umut Patlak Personal Portfolio & Blog

> Bu dosya, AI kodlama asistanları için proje bağlamını, mimarisini ve kurallarını tanımlar.

## Proje Özeti

Full-stack kişisel portfolyo, interaktif CV ve dinamik Markdown blog platformu.
**Sahibi:** Umut Patlak — [umutpatlak.com](https://umutpatlak.com)

---

## Teknoloji Stack'i

### Frontend (`/client`) — Port 5173
| Teknoloji | Versiyon | Kullanım |
|---|---|---|
| React | 19 | UI library |
| TypeScript | ~5.7 | Type safety |
| Vite | 6 | Build tooling |
| Tailwind CSS | v4 | Utility-first styling (`@tailwindcss/vite` plugin) |
| Framer Motion | 11 | Animasyonlar & geçişler |
| TanStack React Query | v5 | Server-state yönetimi & cache |
| React Router | v7 | Client-side routing |
| Lucide React | — | İkonlar |
| React Markdown + GFM | — | Blog içerik render |
| react-i18next + i18next | — | Çoklu dil desteği (TR/EN) |
| react-helmet-async | — | SEO meta tag yönetimi |

### Backend (`/server`) — Port 3000
| Teknoloji | Versiyon | Kullanım |
|---|---|---|
| NestJS | 11 | Enterprise Node.js framework |
| TypeScript | ~5.7 | Type safety |
| PostgreSQL | 16 (Docker) | İlişkisel veritabanı |
| Drizzle ORM + Kit | 0.38+ | Type-safe ORM & migration |
| Passport + JWT | — | Token tabanlı kimlik doğrulama |
| Bcrypt | — | Parola hashleme |
| Class Validator/Transformer | — | DTO validasyonu |
| Throttler | — | Rate limiting (60s / 30 req) |

---

## Proje Yapısı

```
WebSite/
├── client/                          # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx                  # Root router (BrowserRouter + Routes)
│   │   ├── main.tsx                 # Entry point
│   │   ├── index.css                # Design tokens & Tailwind styles
│   │   ├── components/
│   │   │   ├── admin/               # ProtectedRoute
│   │   │   ├── blog/                # BlogCard
│   │   │   ├── home/                # Hero, About, Skills, Experience, Education, Projects, Contact
│   │   │   ├── layout/              # Navbar, Footer, Layout
│   │   │   ├── seo/                 # SEO bileşenleri
│   │   │   └── ui/                  # Badge, Button, Card, Container, Input, Textarea,
│   │   │                              SectionHeading, ThemeToggle, LanguageToggle
│   │   ├── data/                    # Statik veri dosyaları
│   │   ├── hooks/                   # useAuth, useScrollAnimation, useTheme
│   │   ├── i18n/
│   │   │   ├── i18n.ts             # i18next config
│   │   │   └── locales/            # en.json, tr.json
│   │   ├── lib/                     # Utility fonksiyonlar
│   │   ├── pages/                   # HomePage, BlogPage, BlogPostPage,
│   │   │                              AdminLoginPage, AdminDashboardPage, AdminPostEditorPage
│   │   ├── services/                # api.ts (axios), authService, blogService,
│   │   │                              contactService, projectService
│   │   └── types/                   # TypeScript interfaces
│   ├── vite.config.ts               # Vite config: API proxy (/api → :3000), path alias (@/)
│   └── index.html
│
├── server/                          # NestJS backend
│   ├── src/
│   │   ├── main.ts                  # Bootstrap: CORS, ValidationPipe, prefix /api
│   │   ├── app.module.ts            # Root module: Config, Throttler, DB, Auth, Blog, Projects, Contact
│   │   ├── auth/                    # JWT auth: login, profile, guards, strategies
│   │   ├── blog/                    # Blog CRUD: posts (draft/published), slug, tags
│   │   ├── projects/                # Projeler CRUD: featured, ordering, tech stack
│   │   ├── contact/                 # İletişim formu: mesajlar, okundu/okunmadı
│   │   ├── common/                  # Interceptors, filters, decorators
│   │   ├── config/                  # Ortam yapılandırma
│   │   └── db/
│   │       ├── schema.ts            # Drizzle şema: users, posts, projects, messages
│   │       ├── database.module.ts   # DB bağlantı modülü
│   │       └── seed.ts              # İlk admin hesabı seed
│   ├── drizzle.config.ts
│   └── .env / .env.example
│
├── docker-compose.yml               # PostgreSQL 16-alpine (portfolio_postgres)
└── README.md
```

---

## Route Yapısı

### Public Routes
| Path | Sayfa | Açıklama |
|---|---|---|
| `/` | HomePage | Hero, About, Skills, Experience, Education, Projects, Contact |
| `/blog` | BlogPage | Blog listesi (arama & tag filtre) |
| `/blog/:slug` | BlogPostPage | Tekil blog yazısı |

### Admin Routes (ProtectedRoute ile korumalı)
| Path | Sayfa | Açıklama |
|---|---|---|
| `/admin/login` | AdminLoginPage | Admin giriş |
| `/admin/dashboard` | AdminDashboardPage | Blog, proje, mesaj yönetimi |
| `/admin/posts/new` | AdminPostEditorPage | Yeni blog yazısı |
| `/admin/posts/:id/edit` | AdminPostEditorPage | Yazı düzenleme |

---

## API Endpoints

Tüm endpoint'ler `/api` prefix'i altında çalışır.

| Method | Endpoint | Auth | Açıklama |
|---|---|---|---|
| `POST` | `/api/auth/login` | ❌ | JWT token al |
| `GET` | `/api/auth/profile` | ✅ | Aktif kullanıcı profili |
| `GET` | `/api/blog` | ❌ | Yayınlanan yazılar (search, tag filtre) |
| `GET` | `/api/blog/:slug` | ❌ | Slug ile tekil yazı |
| `GET` | `/api/blog/admin/all` | ✅ | Tüm yazılar (draft dahil) |
| `POST` | `/api/blog` | ✅ | Yeni yazı oluştur |
| `PUT` | `/api/blog/:id` | ✅ | Yazı güncelle |
| `DELETE` | `/api/blog/:id` | ✅ | Yazı sil |
| `GET` | `/api/projects` | ❌ | Tüm projeler |
| `POST` | `/api/projects` | ✅ | Proje oluştur |
| `PUT` | `/api/projects/:id` | ✅ | Proje güncelle |
| `DELETE` | `/api/projects/:id` | ✅ | Proje sil |
| `POST` | `/api/contact` | ❌ | İletişim formu gönder (rate limited) |
| `GET` | `/api/contact` | ✅ | Mesajları listele |
| `PATCH` | `/api/contact/:id/read` | ✅ | Okundu işaretle |
| `DELETE` | `/api/contact/:id` | ✅ | Mesaj sil |

---

## Veritabanı Şeması (Drizzle ORM)

4 tablo: `users`, `posts`, `projects`, `messages`

- **users** → `id`, `email` (unique), `passwordHash`, `name`, `createdAt`
- **posts** → `id`, `title`, `slug` (unique), `summary`, `content`, `coverImage`, `tags[]`, `status` (draft/published enum), `readingTime`, `authorId` (FK→users), `publishedAt`, `createdAt`, `updatedAt`
- **projects** → `id`, `title`, `description`, `technologies[]`, `githubUrl`, `demoUrl`, `imageUrl`, `featured`, `order`, `createdAt`
- **messages** → `id`, `name`, `email`, `subject`, `message`, `isRead`, `createdAt`

**İlişkiler:** `users` 1:N `posts` (cascade delete)

---

## Geliştirme Kuralları

### Genel
- **Dil:** TypeScript — her iki tarafta da strict type kullan
- **Path alias:** Client tarafında `@/` → `src/` (vite.config.ts'de tanımlı)
- **Stil:** Tailwind CSS v4 — `@tailwindcss/vite` plugin ile (PostCSS yok)
- **Animasyonlar:** Framer Motion kullan, CSS animasyonlarından kaçın
- **Ikonlar:** Lucide React kullan, başka icon kütüphanesi ekleme
- **i18n:** Tüm kullanıcıya görünen metinler `i18n/locales/tr.json` ve `en.json`'da olmalı, hardcode metin yazma

### Frontend Kuralları
- Component'ler fonksiyonel olmalı (class component kullanma)
- State yönetimi: React Query (server state), React useState/useReducer (local state)
- React Query `staleTime`: 5 dakika (default)
- Sayfa SEO'su: `react-helmet-async` ile meta tag yönetimi
- Yeni sayfa eklenince `App.tsx`'e route ekle
- API istekleri `services/` altındaki servisler üzerinden yapılmalı
- Axios instance `services/api.ts`'de tanımlı — tüm servisler bunu kullanmalı

### Backend Kuralları
- Global prefix: `/api` (main.ts)
- Validation: `ValidationPipe` (whitelist, forbidNonWhitelisted, transform)
- Yeni modül eklenince `app.module.ts`'e import et
- DTO validasyonu: `class-validator` + `class-transformer`
- Korumalı endpoint'ler JWT guard kullanmalı
- Rate limiting: ThrottlerModule (60s / 30 request)
- CORS: `main.ts`'de dinamik origin kontrolü (env + default + regex)

### Veritabanı
- Şema değişikliği: `server/src/db/schema.ts`'i düzenle
- Şema push: `cd server && npm run db:push`
- Migration oluştur: `npm run db:generate`, uygula: `npm run db:migrate`
- Drizzle Studio: `npm run db:studio`
- Type export: Şemadan `$inferSelect` / `$inferInsert` ile

---

## Sık Kullanılan Komutlar

```bash
# Frontend
cd client && npm run dev          # Vite dev server (port 5173)
cd client && npm run build        # Production build (tsc + vite build)

# Backend
cd server && npm run dev          # NestJS watch mode (port 3000)
cd server && npm run build        # Production build

# Veritabanı
docker compose up -d              # PostgreSQL başlat
cd server && npm run db:push      # Şemayı DB'ye push et
cd server && npm run seed         # Admin hesabını seed et
cd server && npm run db:studio    # Drizzle Studio GUI

# Lint
cd client && npm run lint         # ESLint
```

---

## Ortam Değişkenleri (`server/.env`)

| Değişken | Açıklama | Varsayılan |
|---|---|---|
| `PORT` | Server portu | `3000` |
| `NODE_ENV` | Ortam | `production` |
| `CORS_ORIGINS` | İzin verilen origin'ler (virgülle ayrılmış) | — |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_USER` | PostgreSQL user | `postgres` |
| `DATABASE_PASSWORD` | PostgreSQL şifre | — |
| `DATABASE_NAME` | Veritabanı adı | `umut_portfolio` |
| `JWT_SECRET` | JWT imzalama anahtarı (min 32 karakter) | — |
| `JWT_EXPIRATION` | Token geçerlilik süresi | `7d` |
| `ADMIN_EMAIL` | Seed admin e-posta | — |
| `ADMIN_PASSWORD` | Seed admin şifre | — |
| `ADMIN_NAME` | Seed admin adı | — |

---

## Dikkat Edilmesi Gerekenler

- ⚠️ `.env` dosyası Git'e **commit edilmemeli** — `.gitignore`'da tanımlı
- ⚠️ Vite proxy `/api` isteklerini backend'e yönlendirir — production'da reverse proxy (Nginx) gerekir
- ⚠️ Docker Compose sadece PostgreSQL içerir, uygulama Docker'da değil
- ⚠️ `postStatusEnum` PostgreSQL enum'u — yeni status eklemek migration gerektirir
- ⚠️ Tailwind CSS **v4** kullanılıyor — v3 syntax'ı farklıdır, `tailwind.config.js` yok, config CSS `@theme` ile yapılır
