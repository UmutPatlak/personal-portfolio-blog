import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly uploadBaseDir = path.join(process.cwd(), 'uploads');
  private readonly imagesDir = path.join(this.uploadBaseDir, 'images');
  private readonly docsDir = path.join(this.uploadBaseDir, 'documents');

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    if (!fs.existsSync(this.imagesDir)) {
      fs.mkdirSync(this.imagesDir, { recursive: true });
    }
    if (!fs.existsSync(this.docsDir)) {
      fs.mkdirSync(this.docsDir, { recursive: true });
    }
  }

  saveImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type (${file.mimetype}). Allowed types: JPEG, PNG, WebP, GIF.`
      );
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      throw new BadRequestException('Image size cannot exceed 5MB');
    }

    this.ensureDirectories();
    const ext = path.extname(file.originalname).toLowerCase() || '.webp';
    const filename = `${randomUUID()}${ext}`;
    const destination = path.join(this.imagesDir, filename);

    fs.writeFileSync(destination, file.buffer);

    return {
      url: `/uploads/images/${filename}`,
      filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  saveDocument(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No document file provided');
    }

    const allowedMimeTypes = ['application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type (${file.mimetype}). Only PDF files are allowed.`
      );
    }

    const maxSizeBytes = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSizeBytes) {
      throw new BadRequestException('Document size cannot exceed 15MB');
    }

    this.ensureDirectories();
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf';
    const filename = `${randomUUID()}${ext}`;
    const destination = path.join(this.docsDir, filename);

    fs.writeFileSync(destination, file.buffer);

    return {
      url: `/uploads/documents/${filename}`,
      filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
