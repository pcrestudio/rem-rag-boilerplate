import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import pdf from 'pdf-parse';
import { WeaviateService } from '../weaviate/weaviate.service';

@Injectable()
export class PdfIngestService {
  constructor(private weaviateService: WeaviateService) {}

  async processPDF(filePath: string) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      const text = pdfData.text.replace(/\s+/g, ' ').trim(); // Limpiar texto

      console.log(
        `📄 PDF Procesado (${filePath}):`,
        text.slice(0, 200) + '...',
      );

      //await this.weaviateService.addDocument(filePath, text);
      return { filePath, success: true };
    } catch (error) {
      console.error(`❌ Error procesando ${filePath}:`, error);
      return { filePath, success: false, error: error.message };
    }
  }
}
