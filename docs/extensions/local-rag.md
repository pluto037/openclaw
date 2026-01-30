# Local Knowledge Base (RAG)

The `extensions/local-rag` plugin enables OpenClaw to ingest and query local documents (Markdown, Text) using a local vector database and embedding model.

## Features

- **Local Storage**: Uses [LanceDB](https://lancedb.com/) to store vectors on disk.
- **Local Embeddings**: Supports [Ollama](https://ollama.ai/) for completely offline operation.
- **Hybrid Support**: Can also use OpenAI embeddings if configured.
- **Tools**:
    - `knowledge_search`: Allows agents to query the knowledge base.
- **CLI**:
    - `ingest`: Scan a directory and add files to the knowledge base.

## Prerequisites

### 1. Install Ollama (Optional, for local embeddings)
Download and install [Ollama](https://ollama.ai/).
Pull an embedding model:
```bash
ollama pull nomic-embed-text
```

## Configuration

Add to `config.json`:

```json
{
  "extensions": {
    "local-rag": {
      "dbPath": "~/.openclaw/rag-data",
      "embedding": {
        "provider": "ollama",
        "model": "nomic-embed-text",
        "baseUrl": "http://localhost:11434"
      }
    }
  }
}
```

Or use OpenAI:

```json
{
  "extensions": {
    "local-rag": {
      "embedding": {
        "provider": "openai",
        "apiKey": "sk-...",
        "model": "text-embedding-3-small"
      }
    }
  }
}
```

## Usage

### Ingest Documents

Use the CLI to add files to your knowledge base:

```bash
# Ingest all markdown files in the docs directory
openclaw rag ingest ./docs --pattern "**/*.md"
```

### Querying

Agents can now use the `knowledge_search` tool.

**Example User Query:**
"What does the documentation say about configuring channels?"

**Agent Action:**
Calls `knowledge_search(query="configuring channels")` and uses the result to answer.
