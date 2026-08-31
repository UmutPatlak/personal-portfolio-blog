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

  // Parse CORS origins from environment variable (comma-separated)
  const envOrigins = config
    .get<string>('CORS_ORIGINS', '')
    .split(',')
    .map((o) => o.trim())
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

      // Check if origin matches allowed list or regex patterns (e.g. Vercel preview or subdomain)
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/.*\.umutpatlak\.com$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
