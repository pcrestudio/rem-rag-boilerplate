import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { WeaviateService } from '../weaviate/weaviate.service';
import { v4 } from 'uuid';

const pdf = require('pdf-parse');

@Injectable()
export class PdfIngestService {
  constructor(private weaviateService: WeaviateService) {}

  async processPDF(filePath: string) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      const text = pdfData.text.replace(/\s+/g, ' ').trim();

      console.log(
        `📄 PDF Procesado (${filePath}):`,
        text.slice(0, 200) + '...',
      );

      const chunks = this.chunkText(text, 500); // 👈 ajustá el tamaño si querés

      let successCount = 0;
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const id = v4();
        await this.weaviateService.addChunk(id, {
          content: chunk,
          source: filePath,
          chunkIndex: i,
        });
        successCount++;
      }

      return {
        filePath,
        chunksInserted: successCount,
        success: true,
      };
    } catch (error) {
      console.error(`❌ Error procesando ${filePath}:`, error);
      return { filePath, success: false, error: error.message };
    }
  }

  private chunkText(text: string, maxWords: number): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += maxWords) {
      const chunk = words.slice(i, i + maxWords).join(' ');
      chunks.push(chunk);
    }

    return chunks;
  }
}
