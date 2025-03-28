import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import pdfParse from 'pdf-parse';
import { recognize } from 'tesseract.js';

@Injectable()
export class PdfProcessorService {
  async extractText(filePath: string): Promise<string> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);

      if (data.text.trim()) return data.text;

      return await this.extractTextWithOCR(filePath);
    } catch (error) {
      console.error('Error procesando PDF:', error);
      return '';
    }
  }

  private async extractTextWithOCR(filePath: string): Promise<string> {
    const { data } = await recognize(filePath, 'spa');
    return data.text;
  }
}
