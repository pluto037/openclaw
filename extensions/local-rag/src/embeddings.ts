import axios from "axios";

export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
}

export class OllamaEmbeddings implements EmbeddingProvider {
  constructor(
    private baseUrl: string,
    private model: string
  ) {}

  async embed(text: string): Promise<number[]> {
    try {
      const res = await axios.post(`${this.baseUrl}/api/embeddings`, {
        model: this.model,
        prompt: text
      });
      return res.data.embedding;
    } catch (e: any) {
      throw new Error(`Ollama embedding failed: ${e.message}`);
    }
  }
}

export class OpenAIEmbeddings implements EmbeddingProvider {
  constructor(
    private apiKey: string,
    private model: string
  ) {}

  async embed(text: string): Promise<number[]> {
    try {
      const res = await axios.post("https://api.openai.com/v1/embeddings", {
        model: this.model,
        input: text
      }, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });
      return res.data.data[0].embedding;
    } catch (e: any) {
      throw new Error(`OpenAI embedding failed: ${e.message}`);
    }
  }
}
