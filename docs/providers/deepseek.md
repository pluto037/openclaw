# DeepSeek

OpenClaw supports [DeepSeek](https://www.deepseek.com/) models (DeepSeek V3, DeepSeek R1) via their OpenAI-compatible API.

## Configuration

To use DeepSeek models, you need to set your API key.

### Environment Variable

Set the `DEEPSEEK_API_KEY` environment variable:

```bash
export DEEPSEEK_API_KEY="sk-..."
```

### Auth Profile

Or add it securely via the CLI:

```bash
openclaw agents add --provider deepseek --api-key "sk-..."
```

## Available Models

The following models are available by default:

- `deepseek/deepseek-chat` (DeepSeek V3)
- `deepseek/deepseek-reasoner` (DeepSeek R1, reasoning model)

## Usage

You can specify the model when running an agent:

```bash
openclaw agent --model deepseek/deepseek-chat
```
