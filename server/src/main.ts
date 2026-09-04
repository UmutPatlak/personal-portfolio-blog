import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Parse CORS origins from environment variables (CORS_ORIGINS comma-separated and/or FRONTEND_URL)
  const envOrigins = [
    ...config.get<string>('CORS_ORIGINS', '').split(','),
    config.get<string>('FRONTEND_URL', ''),
  ]
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'https://umutpatlak.com',
    'https://www.umutpatlak.com',
  ];

  const allowedOrigins = Array.from(
    new Set([...defaultOrigins, ...envOrigins]),
  );

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow server-to-server or non-browser tools (curl, Postman, etc.)
      if (!origin) return callback(null, true);

      // Clean trailing slash from incoming origin
      const normalizedOrigin = origin.replace(/\/+$/, '');

      // Check if origin matches allowed list or regex patterns (e.g. Vercel preview or subdomain)
      const isAllowed =
        allowedOrigins.includes(normalizedOrigin) ||
        /^https:\/\/.*\.umutpatlak\.com$/.test(normalizedOrigin) ||
        /^https:\/\/.*\.vercel\.app$/.test(normalizedOrigin);

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  const port = Number(process.env.PORT || config.get('PORT') || 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on port ${port} (0.0.0.0)`);
}

bootstrap();
