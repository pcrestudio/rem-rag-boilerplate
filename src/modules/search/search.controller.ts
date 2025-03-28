import { Controller, Get, Query } from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';
import { WeaviateService } from '../weaviate/weaviate.service';

@Controller('search')
export class SearchController {
  constructor(
    private openAIService: OpenAIService,
    private weaviateService: WeaviateService,
  ) {}

  @Get()
  async search(@Query('q') query: string) {
    const docs = await this.weaviateService.search(query);
    const response = await this.openAIService.query(
      `Basado en estos documentos:\n\n${docs.join('\n\n')}\n\n Responde: ${query}`,
    );

    const parts = response.split('\n\n').map((text, i) => ({
      id: i,
      text: text.trim(),
    }));

    return { query, parts };
  }
}
