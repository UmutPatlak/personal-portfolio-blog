import { BadRequestException } from '@nestjs/common';
import { UploadService } from './upload.service';
import * as fs from 'fs';

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('test-uuid-1234'),
}));

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(() => {
    service = new UploadService();
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
  });

  describe('initialization and ensureDirectories', () => {
    it('should create directories if they do not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      new UploadService();

      expect(fs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining('images'),
        { recursive: true },
      );
      expect(fs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining('documents'),
        { recursive: true },
      );
    });
  });

  // ─── saveImage ────────────────────────────────────────

  describe('saveImage', () => {
    const validImageFile = {
      originalname: 'test-photo.jpg',
      mimetype: 'image/jpeg',
      size: 1024 * 1024, // 1MB
      buffer: Buffer.from('fake-image-data'),
    } as Express.Multer.File;

    it('should accept valid JPEG image', () => {
      const result = service.saveImage(validImageFile);

      expect(result).toEqual({
        url: '/uploads/images/test-uuid-1234.jpg',
        filename: 'test-uuid-1234.jpg',
        originalname: 'test-photo.jpg',
        size: 1024 * 1024,
        mimetype: 'image/jpeg',
      });
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should accept PNG images', () => {
      const pngFile = { ...validImageFile, originalname: 'img.png', mimetype: 'image/png' };
      const result = service.saveImage(pngFile as Express.Multer.File);

      expect(result.mimetype).toBe('image/png');
    });

    it('should accept WebP images', () => {
      const webpFile = { ...validImageFile, originalname: 'img.webp', mimetype: 'image/webp' };
      const result = service.saveImage(webpFile as Express.Multer.File);

      expect(result.mimetype).toBe('image/webp');
    });

    it('should accept GIF images', () => {
      const gifFile = { ...validImageFile, originalname: 'img.gif', mimetype: 'image/gif' };
      const result = service.saveImage(gifFile as Express.Multer.File);

      expect(result.mimetype).toBe('image/gif');
    });

    it('should throw BadRequestException for invalid MIME type', () => {
      const bmpFile = { ...validImageFile, mimetype: 'image/bmp' } as Express.Multer.File;

      expect(() => service.saveImage(bmpFile)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException when size exceeds 5MB', () => {
      const largeFile = {
        ...validImageFile,
        size: 6 * 1024 * 1024, // 6MB
      } as Express.Multer.File;

      expect(() => service.saveImage(largeFile)).toThrow(BadRequestException);
      expect(() => service.saveImage(largeFile)).toThrow('Image size cannot exceed 5MB');
    });

    it('should throw BadRequestException when no file provided', () => {
      expect(() => service.saveImage(null as any)).toThrow(BadRequestException);
      expect(() => service.saveImage(null as any)).toThrow('No image file provided');
    });

    it('should throw BadRequestException when file is undefined', () => {
      expect(() => service.saveImage(undefined as any)).toThrow(BadRequestException);
    });

    it('should default to .webp extension when originalname has no extension', () => {
      const noExtFile = { ...validImageFile, originalname: 'photo' };
      const result = service.saveImage(noExtFile as Express.Multer.File);

      expect(result.filename).toBe('test-uuid-1234.webp');
      expect(result.url).toBe('/uploads/images/test-uuid-1234.webp');
    });
  });

  // ─── saveDocument ─────────────────────────────────────

  describe('saveDocument', () => {
    const validPdfFile = {
      originalname: 'resume.pdf',
      mimetype: 'application/pdf',
      size: 2 * 1024 * 1024, // 2MB
      buffer: Buffer.from('fake-pdf-data'),
    } as Express.Multer.File;

    it('should accept valid PDF document', () => {
      const result = service.saveDocument(validPdfFile);

      expect(result).toEqual({
        url: '/uploads/documents/test-uuid-1234.pdf',
        filename: 'test-uuid-1234.pdf',
        originalname: 'resume.pdf',
        size: 2 * 1024 * 1024,
        mimetype: 'application/pdf',
      });
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should throw BadRequestException for non-PDF document', () => {
      const docxFile = {
        ...validPdfFile,
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      } as Express.Multer.File;

      expect(() => service.saveDocument(docxFile)).toThrow(BadRequestException);
      expect(() => service.saveDocument(docxFile)).toThrow('Only PDF files are allowed');
    });

    it('should throw BadRequestException when size exceeds 15MB', () => {
      const largeFile = {
        ...validPdfFile,
        size: 16 * 1024 * 1024, // 16MB
      } as Express.Multer.File;

      expect(() => service.saveDocument(largeFile)).toThrow(BadRequestException);
      expect(() => service.saveDocument(largeFile)).toThrow('Document size cannot exceed 15MB');
    });

    it('should throw BadRequestException when no file provided', () => {
      expect(() => service.saveDocument(null as any)).toThrow(BadRequestException);
      expect(() => service.saveDocument(null as any)).toThrow('No document file provided');
    });

    it('should default to .pdf extension when originalname has no extension', () => {
      const noExtFile = { ...validPdfFile, originalname: 'resume' };
      const result = service.saveDocument(noExtFile as Express.Multer.File);

      expect(result.filename).toBe('test-uuid-1234.pdf');
      expect(result.url).toBe('/uploads/documents/test-uuid-1234.pdf');
    });
  });
});
