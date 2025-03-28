import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfIngestService } from './pdf-ingest.service';
import * as fs from 'fs';
import { diskStorage } from 'multer';

@Controller('pdf')
export class PdfController {
  constructor(private pdfIngestService: PdfIngestService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, file.originalname); // o algo más seguro si te preocupa sobrescribir
      },
    }),
  }))
  async uploadPdf(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { error: 'No file uploaded' };

    const filePath = `./uploads/${file.originalname}`;

    return this.pdfIngestService.processPDF(filePath);
  }
}
