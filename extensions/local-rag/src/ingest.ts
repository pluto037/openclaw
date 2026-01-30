import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import { RagStore } from "./store.js";
// import pdf from "pdf-parse"; // Optional, need types

export async function ingestDirectory(store: RagStore, dirPath: string, pattern = "**/*.{md,txt}") {
  const files = await glob(pattern, { cwd: dirPath, absolute: true });
  
  let totalChunks = 0;
  
  for (const file of files) {
    const content = await fs.readFile(file, "utf-8");
    const chunks = chunkText(content, 1000); // Simple chunking
    
    await store.addDocuments(chunks.map(chunk => ({
      content: chunk,
      source: file,
      metadata: { filename: path.basename(file) }
    })));
    
    totalChunks += chunks.length;
  }
  
  return { files: files.length, chunks: totalChunks };
}

function chunkText(text: string, size: number): string[] {
  // Very naive chunking
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}
