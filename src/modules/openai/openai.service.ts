import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async query(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-2024-05-13',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message?.content || '';
  }
}
