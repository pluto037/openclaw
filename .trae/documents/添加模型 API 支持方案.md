要为 OpenClaw 添加更多模型支持，主要涉及修改 `src/agents/models-config.providers.ts` 文件。以下是具体方案：

## 1. 定位核心文件
- **文件路径**: `src/agents/models-config.providers.ts`
- **作用**: 定义了所有内置模型提供商（如 MiniMax, Moonshot, Ollama 等）及其支持的模型列表、API 端点和计费信息。

## 2. 修改方案
### 场景 A：为现有提供商添加新模型
如果只需在现有提供商（如 MiniMax）下增加新发布的模型：
1.  在文件中找到对应的构建函数（例如 `buildMinimaxProvider`）。
2.  在 `models` 数组中追加新的模型定义对象。
    *   需指定 `id`, `name`, `contextWindow`, `maxTokens`, `cost` 等字段。

### 场景 B：添加全新的模型提供商
如果要接入一个新的 AI 服务商（例如 DeepSeek 或其他兼容 OpenAI 协议的服务）：
1.  **定义构建函数**: 创建一个新的 `buildNewProviderProvider` 函数。
    *   配置 `baseUrl`。
    *   设置 `api` 类型（通常为 `"openai-completions"` 或 `"anthropic-messages"`）。
    *   定义默认支持的 `models` 列表。
2.  **注册提供商**: 在 `resolveImplicitProviders` 函数中添加逻辑，以便系统能检测到并加载该提供商。
    *   添加 API Key 的获取逻辑（从环境变量或 Auth Store）。

## 3. 示例代码
我们将以添加一个假设的 "DeepSeek" 提供商为例，展示如何编写代码。

### 待添加的代码结构
```typescript
// 1. 定义配置常量
const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";
const DEEPSEEK_DEFAULT_COST = { input: 1, output: 2, cacheRead: 0.5, cacheWrite: 1 }; // 示例价格

// 2. 创建构建函数
function buildDeepSeekProvider(): ProviderConfig {
  return {
    baseUrl: DEEPSEEK_BASE_URL,
    api: "openai-completions",
    models: [
      {
        id: "deepseek-chat",
        name: "DeepSeek Chat",
        reasoning: false,
        input: ["text"],
        cost: DEEPSEEK_DEFAULT_COST,
        contextWindow: 32000,
        maxTokens: 4096,
      },
      // ... 更多模型
    ],
  };
}

// 3. 在 resolveImplicitProviders 中注册
// ... inside resolveImplicitProviders function ...
const deepseekKey =
  resolveEnvApiKeyVarName("deepseek") ??
  resolveApiKeyFromProfiles({ provider: "deepseek", store: authStore });
if (deepseekKey) {
  providers.deepseek = { ...buildDeepSeekProvider(), apiKey: deepseekKey };
}
```

## 4. 后续步骤
确认此方案后，请告知您是希望**添加特定的新模型**（请提供模型名称和参数），还是希望我为您**搭建一个通用的新提供商模板**？
