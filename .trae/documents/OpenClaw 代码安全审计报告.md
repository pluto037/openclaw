## 审计概览

代码库未发现恶意的“后门”或强制的“回传数据”逻辑。所有的外部通信和指令执行均属于设计功能，且通常需要显式配置开启。

## 1. 信息外发 (Data Exfiltration)

* **遥测 (Telemetry)**: 存在 `extensions/diagnostics-otel` 插件。

  * **行为**: 可发送指标（Token消耗、队列深度）和日志到指定的 OTLP 端点。

  * **风险**: 如果**配置不当，可能泄露日志中的敏感**信息。

  * **现状**: **默认关闭**。代码中明确检查 `if (!cfg?.enabled || !otel?.enabled) return;`。

* **LLM API**: 正常的模型调用会将 Prompt 发送给提供商（OpenAI, Anthropic 等）。

* **自动更新**: 会连接 GitHub 或 NPM Registry 检查版本。

## 2. 远程指令执行 (Remote Execution)

* **核心风险**: `src/agents/bash-tools.exec.ts` 允许 Agent 执行任意 Shell 命令。这是项目的核心功能，但也意味着它是 RCE (远程代码执行) 的入口。

* **防御机制**:

  * **审批 (Approval)**: 支持 `ask` (询问) 和 `allowlist` (白名单) 模式。

  * **沙箱 (Sandbox)**: 内置 Docker 支持 (`buildDockerExecArgs`)，强烈建议在生产环境中启用 Docker 隔离。

  * **权限**: 默认配置通常倾向于安全（如 `security="deny"`），但需检查实际使用的配置文件。

## 3. 建议 (Recommendations)

1. **启用 Docker 沙箱**: 确保 Agent 运行在 Docker 容器中，而非直接在宿主机执行命令。
2. **配置审批流**: 在 `config` 中强制开启关键操作的 `ask` 模式。
3. **监控 OTEL 配置**: 检查 `config.diagnostics.otel` 确保未意外开启日志上传。

您是否需要我协助配置 **Docker 沙箱** 或 **安全审批策略**？
