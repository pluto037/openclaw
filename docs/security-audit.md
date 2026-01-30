# OpenClaw Security Audit Report & Guide

## 概览 (Overview)
本文件记录了对 OpenClaw 代码库的安全审计结果，重点关注**数据隐私**（遥测/外发）和**远程指令执行**风险。

**审计结论**: 代码库未发现恶意的“后门”或强制的隐蔽数据回传逻辑。所有外部通信和指令执行均属于设计功能，且具备相应的配置开关。

---

## 1. 数据隐私与遥测 (Data Privacy & Telemetry)

### 1.1 OpenTelemetry (`extensions/diagnostics-otel`)
OpenClaw 包含一个基于 OpenTelemetry 的插件，用于收集性能指标和日志。

*   **默认状态**: **关闭**。
*   **触发条件**: 仅当配置中明确设置 `diagnostics.enabled = true` 且 `diagnostics.otel.enabled = true` 时才会启动。
*   **数据内容**: 
    *   Token 消耗量与成本估算
    *   消息队列深度与处理延迟
    *   **日志** (可选): 如果开启，系统日志（包含可能的敏感信息）会被发送到配置的 OTLP 端点。
*   **安全建议**: 
    *   仅在受信任的内部网络中使用 OTLP 收集器。
    *   避免在公共/不可信的端点上启用日志上传。

### 1.2 LLM 提供商交互
*   **行为**: 为了生成回复，用户的输入（Prompt）会被发送给配置的模型提供商（如 OpenAI, Anthropic, MiniMax 等）。
*   **控制**: 用户完全控制使用哪些提供商以及 API Key。

### 1.3 自动更新
*   **行为**: CLI (`src/cli/update-cli.ts`) 会连接 GitHub 或 NPM Registry 检查新版本。
*   **风险**: 依赖于 GitHub 和 NPM 的供应链安全。

---

## 2. 远程指令执行 (Remote Execution)

OpenClaw 的核心功能之一是 Agent 能够执行 Shell 指令 (`src/agents/bash-tools.exec.ts`)。这是高风险高回报的功能。

### 2.1 风险点
Agent 理论上可以执行宿主机上的任意命令（`rm -rf /`, `curl ... | sh`），如果被恶意 Prompt 注入或连接到不可信的 Webhook 源，可能导致主机被入侵。

### 2.2 防御机制 (Safeguards)

#### A. 审批流 (Approval Workflow)
可以配置 Agent 在执行命令前必须经过人工审批。
*   **Ask Mode (`ask`)**:
    *   `off`: 不询问，直接执行（高风险）。
    *   `on-miss`: 仅当指令不在白名单时询问。
    *   `always`: 每次执行都必须询问。
*   **Security Mode (`security`)**:
    *   `deny`: 拒绝执行（除非另有授权）。
    *   `allowlist`: 仅允许白名单内的指令。
    *   `full`: 允许所有指令（需配合 `ask` 使用）。

#### B. Docker 沙箱 (Docker Sandbox)
**强烈建议**在生产环境或处理不可信任务时启用 Docker 沙箱。启用后，Agent 的所有 Shell 指令将在隔离的容器中运行。

**配置示例 (`config.json`)**:
```json
{
  "tools": {
    "exec": {
      "host": "sandbox",
      "sandbox": {
        "image": "node:22-bookworm-slim",
        "containerName": "openclaw-sandbox"
      }
    }
  }
}
```

---

## 3. 安全配置核查清单 (Checklist)

- [ ] **确认 OTEL 关闭**: 检查配置，确保未意外开启 `diagnostics.otel.enabled`，除非你有明确监控需求。
- [ ] **启用审批**: 对于敏感操作，设置 `ask: "always"` 或 `ask: "on-miss"`。
- [ ] **使用沙箱**: 只要条件允许，请配置 `host: "sandbox"` 并安装 Docker。
- [ ] **API Key 保护**: 不要在代码库中硬编码 API Key，使用环境变量或 `auth.json`。
