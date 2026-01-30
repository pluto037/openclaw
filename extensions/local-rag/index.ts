import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { z } from "zod";
import { RagStore } from "./src/store.js";
import { OllamaEmbeddings, OpenAIEmbeddings } from "./src/embeddings.js";
import { ingestDirectory } from "./src/ingest.js";
import path from "node:path";
import os from "node:os";

const ConfigSchema = z.object({
  dbPath: z.string().default(path.join(os.homedir(), ".openclaw", "rag-data")),
  embedding: z.object({
    provider: z.enum(["ollama", "openai"]).default("ollama"),
    model: z.string().default("nomic-embed-text"),
    baseUrl: z.string().optional().default("http://localhost:11434"),
    apiKey: z.string().optional()
  }).default({})
});

const plugin = {
  id: "local-rag",
  name: "Local RAG",
  description: "Local Knowledge Base (RAG) using LanceDB and Ollama/OpenAI",
  configSchema: ConfigSchema,
  
  register(api: OpenClawPluginApi) {
    const cfg = ConfigSchema.parse(api.pluginConfig || {});
    
    // Setup Embedder
    let embedder;
    if (cfg.embedding.provider === "openai" && cfg.embedding.apiKey) {
      embedder = new OpenAIEmbeddings(cfg.embedding.apiKey, cfg.embedding.model);
    } else {
      embedder = new OllamaEmbeddings(cfg.embedding.baseUrl, cfg.embedding.model);
    }
    
    // Setup Store
    const store = new RagStore(cfg.dbPath, embedder);
    
    api.logger.info(`Local RAG initialized at ${cfg.dbPath} using ${cfg.embedding.provider}`);

    // Register Tool
    api.registerTool({
      name: "knowledge_search",
      label: "Knowledge Search",
      description: "Search the local knowledge base (documents, guides, etc.)",
      parameters: z.object({
        query: z.string().describe("The search query"),
        limit: z.number().optional().default(5)
      }),
      execute: async (id, params: any) => {
        try {
          const results = await store.search(params.query, params.limit);
          if (results.length === 0) return { content: [{ type: "text", text: "No relevant documents found." }] };
          
          const text = results.map((r, i) => 
            `[${i+1}] (Score: ${r.score.toFixed(2)}) Source: ${path.basename(r.doc.source)}\n${r.doc.content}`
          ).join("\n\n---\n\n");
          
          return { content: [{ type: "text", text }] };
        } catch (e: any) {
          return { content: [{ type: "text", text: `Error: ${e.message}` }] };
        }
      }
    }, { name: "knowledge_search" });

    // Register CLI
    api.registerCli((cli) => {
      const rag = cli.program.command("rag").description("Local RAG commands");
      
      rag.command("ingest")
        .argument("<path>", "Path to directory or file")
        .option("--pattern <pattern>", "File pattern", "**/*.{md,txt}")
        .action(async (dir, opts) => {
          console.log(`Ingesting from ${dir}...`);
          try {
             const stats = await ingestDirectory(store, dir, opts.pattern);
             console.log(`Ingested ${stats.files} files (${stats.chunks} chunks).`);
          } catch (e: any) {
            console.error(`Ingest failed: ${e.message}`);
          }
        });
        
      rag.command("search")
        .argument("<query>", "Search query")
        .action(async (query) => {
           const results = await store.search(query);
           results.forEach(r => {
             console.log(`\n[${r.score.toFixed(2)}] ${r.doc.source}`);
             console.log(r.doc.content.slice(0, 200) + "...");
           });
        });
    }, { commands: ["rag"] });
    
    // Hook: Auto-inject knowledge? 
    // Maybe enabled via config. For now let's leave it as a tool.
  }
};

export default plugin;
