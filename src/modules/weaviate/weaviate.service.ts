import { Injectable, OnModuleInit } from '@nestjs/common';
import weaviate, { WeaviateClient } from 'weaviate-client';

@Injectable()
export class WeaviateService implements OnModuleInit {
  private client: WeaviateClient;

  async onModuleInit() {
    await this.connectToWeaviate();

    await this.initCollection();
  }

  private async connectToWeaviate(retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
      try {
        this.client = await weaviate.connectToLocal({
          host: '127.0.0.1',
          port: 8080,
          grpcPort: 50051,
          timeout: { init: 30, query: 60, insert: 120 },
        });
        console.log('✅ Conectado a Weaviate');
        return;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.error(
          `⏳ Intento ${i + 1}: Weaviate no está disponible aún...`,
        );
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    throw new Error(
      '❌ No se pudo conectar a Weaviate después de varios intentos.',
    );
  }

  async initCollection() {
    const classes = await this.client.collections.listAll();
    const classExists = classes.some((c) => c.name === 'Jurisprudencia');

    if (!classExists) {
      await this.client.collections.create({
        name: 'Jurisprudencia',
        references: [],
        properties: [{ name: 'content', dataType: 'text' }],
      });
    }
  }

  async addDocument(id: string, text: string) {
    await this.client.collections.get('Jurisprudencia').data.insert({
      id,
      properties: { content: text },
    });
  }

  async search(query: string) {
    const result = await this.client.collections
      .get('Jurisprudencia')
      .query.nearText(query);

    return result.objects.map((doc) => doc.properties.content);
  }
}
