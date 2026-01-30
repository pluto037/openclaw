import * as lancedb from "@lancedb/lancedb";
import { randomUUID } from "node:crypto";
import { EmbeddingProvider } from "./embeddings.js";

export interface Document {
  id: string;
  content: string;
  source: string;
  metadata: Record<string, any>;
  createdAt: number;
}

interface VectorEntry {
  id: string;
  vector: number[];
  content: string;
  source: string;
  metadata: string; // JSON string
  createdAt: number;
  [key: string]: unknown; // Index signature for LanceDB
}

export class RagStore {
  private db: lancedb.Connection | null = null;
  private table: lancedb.Table | null = null;

  constructor(
    private dbPath: string,
    private embedder: EmbeddingProvider
  ) {}

  async init() {
    if (this.db) return;
    this.db = await lancedb.connect(this.dbPath);
    
    const tables = await this.db.tableNames();
    if (tables.includes("documents")) {
      this.table = await this.db.openTable("documents");
    }
  }

  async addDocuments(docs: Omit<Document, "id" | "createdAt">[]) {
    await this.init();
    
    const entries: VectorEntry[] = [];
    
    for (const doc of docs) {
      const vector = await this.embedder.embed(doc.content);
      entries.push({
        id: randomUUID(),
        vector,
        content: doc.content,
        source: doc.source,
        metadata: JSON.stringify(doc.metadata),
        createdAt: Date.now()
      });
    }

    if (!this.table) {
      this.table = await this.db!.createTable("documents", entries);
    } else {
      await this.table.add(entries);
    }
    
    return entries.length;
  }

  async search(query: string, limit = 5): Promise<{ doc: Document; score: number }[]> {
    await this.init();
    if (!this.table) return [];

    const vector = await this.embedder.embed(query);
    const results = await this.table.vectorSearch(vector).limit(limit).toArray();

    return results.map((r: any) => ({
      doc: {
        id: r.id as string,
        content: r.content as string,
        source: r.source as string,
        metadata: JSON.parse(r.metadata as string),
        createdAt: r.createdAt as number
      },
      score: 1 - (r._distance || 0) // Approximation
    }));
  }
  
  async count() {
    await this.init();
    if (!this.table) return 0;
    return this.table.countRows();
  }
}
