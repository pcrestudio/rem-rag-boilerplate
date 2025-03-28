import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchController } from './modules/search/search.controller';
import { ConfigModule } from '@nestjs/config';
import { OpenAIService } from './modules/openai/openai.service';
import { PdfIngestService } from './modules/pdf-ingest/pdf-ingest.service';
import { WeaviateService } from './modules/weaviate/weaviate.service';
import { PdfController } from './modules/pdf-ingest/pdf-ingest.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [AppController, SearchController, PdfController],
  providers: [AppService, OpenAIService, PdfIngestService, WeaviateService],
})
export class AppModule {}
