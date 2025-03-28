import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfIngestService } from './pdf-ingest.service';
import * as fs from 'fs';

@Controller('pdf')
export class PdfController {
  constructor(private pdfIngestService: PdfIngestService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { error: 'No file uploaded' };

    const filePath = `./uploads/${file.originalname}`;
    fs.writeFileSync(filePath, file.buffer);

    return this.pdfIngestService.processPDF(filePath);
  }
}
