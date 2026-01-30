# 🦞 OpenClaw — 您的私人 AI 助手

<p align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text-dark.png">
        <img src="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text.png" alt="OpenClaw" width="500">
    </picture>
</p>

<p align="center">
  <strong>EXFOLIATE! EXFOLIATE!</strong>
</p>

<p align="center">
  <a href="https://github.com/openclaw/openclaw/actions/workflows/ci.yml?branch=main"><img src="https://img.shields.io/github/actions/workflow/status/openclaw/openclaw/ci.yml?branch=main&style=for-the-badge" alt="CI status"></a>
  <a href="https://github.com/openclaw/openclaw/releases"><img src="https://img.shields.io/github/v/release/openclaw/openclaw?include_prereleases&style=for-the-badge" alt="GitHub release"></a>
  <a href="https://discord.gg/clawd"><img src="https://img.shields.io/discord/1456350064065904867?label=Discord&logo=discord&logoColor=white&color=5865F2&style=for-the-badge" alt="Discord"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License"></a>
</p>

**OpenClaw** 是运行在您自己设备上的**私人 AI 助手**。
它能够在您常用的通讯软件上回复您（WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, Microsoft Teams, WebChat），并支持通过插件扩展更多渠道（如 BlueBubbles, Matrix, Zalo 等）。它支持在 macOS/iOS/Android 上进行语音对话，并能渲染一个由您控制的实时 Canvas 画布。Gateway（网关）只是控制平面 —— 真正的产品是这个无处不在的助手。

如果您想要一个感觉本地化、响应迅速且永远在线的个人单用户助手，这就是您的最佳选择。

[官网](https://openclaw.ai) · [文档](https://docs.openclaw.ai) · [DeepWiki](https://deepwiki.com/openclaw/openclaw) · [快速开始](https://docs.openclaw.ai/start/getting-started) · [更新指南](https://docs.openclaw.ai/install/updating) · [展示](https://docs.openclaw.ai/start/showcase) · [常见问题](https://docs.openclaw.ai/start/faq) · [安装向导](https://docs.openclaw.ai/start/wizard) · [Nix](https://github.com/openclaw/nix-clawdbot) · [Docker](https://docs.openclaw.ai/install/docker) · [Discord 社区](https://discord.gg/clawd)

推荐安装方式：运行引导向导 (`openclaw onboard`)。它会一步步协助您配置网关、工作区、渠道和技能。CLI 向导是推荐路径，**完美支持 macOS, Linux, 和 Windows (强烈推荐使用 WSL2)**。

支持 npm, pnpm, 或 bun。
新用户？请从这里开始：[快速入门指南](https://docs.openclaw.ai/start/getting-started)

**支持的模型订阅 (OAuth/API Key):**
- **[DeepSeek](https://www.deepseek.com/)** (V3 Chat / R1 Reasoner) ✨ **新增**
- **[Anthropic](https://www.anthropic.com/)** (Claude Pro/Max)
- **[OpenAI](https://openai.com/)** (ChatGPT/Codex)
- **[Venice.ai](https://venice.ai/)** (隐私优先推理) ✨ **新增**
- **[Google Gemini](https://deepmind.google/technologies/gemini/)**
- 以及 Moonshot (Kimi), Minimax, ZAI, Xiaomi 等更多模型。

模型建议：虽然支持任意模型，但我强烈推荐 **Anthropic Pro/Max (100/200) + Opus 4.5** 或 **DeepSeek V3/R1** 以获得最佳的长上下文处理能力和抗提示注入能力。详见 [Onboarding](https://docs.openclaw.ai/start/onboarding)。

## ✨ 核心亮点 (Highlights)

- **[DeepSeek 深度集成](https://docs.openclaw.ai/providers/deepseek)** — 全面支持 DeepSeek V3 (Chat) 和 R1 (Reasoner) 模型，提供高性价比的推理与思考能力。
- **[增强记忆 (Memory RAG)](https://docs.openclaw.ai/concepts/memory)** — 全新的混合检索 (Hybrid Search) 与向量去重机制，大幅提升知识库召回精度与效率。
- **[本地优先网关 (Local-first Gateway)](https://docs.openclaw.ai/gateway)** — 统一控制平面，管理会话、渠道、工具和事件。
- **[多渠道收件箱](https://docs.openclaw.ai/channels)** — 聚合 WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, BlueBubbles, Microsoft Teams, Matrix, Zalo 等所有消息。
- **[多智能体路由](https://docs.openclaw.ai/gateway/configuration)** — 将入站渠道、账户或对等节点路由到隔离的智能体（支持独立工作区 + 独立会话）。
- **[语音唤醒 (Voice Wake)](https://docs.openclaw.ai/nodes/voicewake) + [对话模式](https://docs.openclaw.ai/nodes/talk)** — macOS/iOS/Android 上的全天候语音待机，集成 ElevenLabs 支持。
- **[实时 Canvas](https://docs.openclaw.ai/platforms/mac/canvas)** — 智能体驱动的可视化工作区，支持 [A2UI](https://docs.openclaw.ai/platforms/mac/canvas#canvas-a2ui)。
- **[一等公民工具](https://docs.openclaw.ai/tools)** — 浏览器控制、Canvas、系统节点、Cron 定时任务、以及 Discord/Slack 深度操作。
- **[配套应用](https://docs.openclaw.ai/platforms/macos)** — macOS 菜单栏应用 + iOS/Android [节点应用](https://docs.openclaw.ai/nodes)。
- **[向导](https://docs.openclaw.ai/start/wizard) + [技能市场](https://docs.openclaw.ai/tools/skills)** — 向导式安装与管理，支持从 ClawdHub 安装技能。

## 🚀 快速开始 (Quick start)

运行环境要求：**Node ≥22**。

完整的新手指南（包含认证、配对、渠道配置）：[快速入门指南](https://docs.openclaw.ai/start/getting-started)

```bash
npm install -g openclaw@latest
# 或者: pnpm add -g openclaw@latest

# 启动交互式安装向导 (自动安装后台服务)
openclaw onboard --install-daemon

# 手动启动网关 (如果未作为服务安装)
openclaw gateway --port 18789 --verbose

# 发送测试消息
openclaw message send --to +1234567890 --message "Hello from OpenClaw"

# 与助手对话 (或通过已连接的 WhatsApp/Telegram/Slack 等渠道对话)
openclaw agent --message "Ship checklist" --thinking high
```

需要升级？请查看 [更新指南](https://docs.openclaw.ai/install/updating) (并运行 `openclaw doctor` 检查健康状态)。

## 模型 (选择与认证)

- 模型配置与 CLI: [Models](https://docs.openclaw.ai/concepts/models)
- 认证轮换 (OAuth vs API keys) + 故障转移: [Model failover](https://docs.openclaw.ai/concepts/model-failover)

## 开发渠道 (Development channels)

- **stable**: 正式发布版 (`vYYYY.M.D`), npm dist-tag `latest`。
- **beta**: 预发布版 (`vYYYY.M.D-beta.N`), npm dist-tag `beta` (可能不包含 macOS 应用)。
- **dev**: `main` 分支的最新代码, npm dist-tag `dev`。

切换渠道: `openclaw update --channel stable|beta|dev`。
详情: [开发渠道](https://docs.openclaw.ai/install/development-channels)。

## 源码安装 (开发模式)

推荐使用 `pnpm` 进行源码构建。`bun` 可选用于直接运行 TypeScript。

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw

pnpm install
pnpm ui:build # 首次运行自动安装 UI 依赖
pnpm build

pnpm openclaw onboard --install-daemon

# 开发循环 (TS 变更自动重载)
pnpm gateway:watch
```

## 安全默认值 (私信访问)

OpenClaw 连接真实的通讯平台。请将所有入站私信 (DM) 视为 **不可信输入**。

完整安全指南: [Security](https://docs.openclaw.ai/gateway/security)

Telegram/WhatsApp/Signal/iMessage/Discord/Slack 等的默认行为：
- **DM 配对模式** (`dmPolicy="pairing"`): 未知发送者会收到一个简短的配对码，机器人不会处理其消息。
- 批准方式: `openclaw pairing approve <channel> <code>` (发送者将被加入白名单)。
- 公开入站 DM 需要显式开启: 设置 `dmPolicy="open"` 并在渠道白名单中包含 `"*"`。

运行 `openclaw doctor` 可检测有风险的 DM 策略配置。

## 星标历史 (Star History)

[![Star History Chart](https://api.star-history.com/svg?repos=openclaw/openclaw&type=date&legend=top-left)](https://www.star-history.com/#openclaw/openclaw&type=date&legend=top-left)

## 我们构建的一切

### 核心平台
- **[Gateway 网关](https://docs.openclaw.ai/gateway)**: 基于 WebSocket 的控制平面，支持会话、状态、配置、Cron、Webhook、[控制 UI](https://docs.openclaw.ai/web) 和 [Canvas 宿主](https://docs.openclaw.ai/platforms/mac/canvas#canvas-a2ui)。
- **[CLI 命令行](https://docs.openclaw.ai/tools/agent-send)**: gateway, agent, send, [wizard](https://docs.openclaw.ai/start/wizard), 和 [doctor](https://docs.openclaw.ai/gateway/doctor)。
- **[Pi Agent 运行时](https://docs.openclaw.ai/concepts/agent)**: RPC 模式，支持工具流式传输和块流式传输。
- **[会话模型 (Session)](https://docs.openclaw.ai/concepts/session)**: 支持直接聊天的 `main` 会话，群组隔离，激活模式，队列模式，自动回复。群组规则: [Groups](https://docs.openclaw.ai/concepts/groups)。
- **[媒体管道](https://docs.openclaw.ai/nodes/images)**: 图像/音频/视频处理，转录钩子，大小限制，临时文件生命周期。音频详情: [Audio](https://docs.openclaw.ai/nodes/audio)。

### 渠道 (Channels)
- **[内置渠道](https://docs.openclaw.ai/channels)**: [WhatsApp](https://docs.openclaw.ai/channels/whatsapp), [Telegram](https://docs.openclaw.ai/channels/telegram), [Slack](https://docs.openclaw.ai/channels/slack), [Discord](https://docs.openclaw.ai/channels/discord), [Google Chat](https://docs.openclaw.ai/channels/googlechat), [Signal](https://docs.openclaw.ai/channels/signal), [iMessage](https://docs.openclaw.ai/channels/imessage)。
- **[扩展渠道](https://docs.openclaw.ai/channels)**: [BlueBubbles](https://docs.openclaw.ai/channels/bluebubbles), [Microsoft Teams](https://docs.openclaw.ai/channels/msteams), [Matrix](https://docs.openclaw.ai/channels/matrix), [Zalo](https://docs.openclaw.ai/channels/zalo), [Zalo Personal](https://docs.openclaw.ai/channels/zalouser), [WebChat](https://docs.openclaw.ai/web/webchat)。
- **[群组路由](https://docs.openclaw.ai/concepts/group-messages)**: 提及(Mention)过滤，回复标签，分渠道分块和路由。

### 应用 + 节点 (Apps + Nodes)
- **[macOS App](https://docs.openclaw.ai/platforms/macos)**: 菜单栏控制中心，[Voice Wake](https://docs.openclaw.ai/nodes/voicewake) 语音唤醒，[Talk Mode](https://docs.openclaw.ai/nodes/talk) 对话模式，远程网关控制。
- **[iOS Node](https://docs.openclaw.ai/platforms/ios)**: Canvas, 语音唤醒，对话模式，摄像头，屏幕录制。
- **[Android Node](https://docs.openclaw.ai/platforms/android)**: Canvas, 对话模式，摄像头，屏幕录制，SMS (可选)。

### 工具 + 自动化
- **[浏览器控制](https://docs.openclaw.ai/tools/browser)**: 专用 Chrome/Chromium 控制，快照，操作，上传，配置文件。
- **[Canvas](https://docs.openclaw.ai/platforms/mac/canvas)**: [A2UI](https://docs.openclaw.ai/platforms/mac/canvas#canvas-a2ui) 推送/重置，求值，快照。
- **[节点工具](https://docs.openclaw.ai/nodes)**: 拍照/录像，屏幕录制，[location.get](https://docs.openclaw.ai/nodes/location-command)，通知。
- **[自动化](https://docs.openclaw.ai/automation/cron-jobs)**: Cron + 唤醒; [Webhooks](https://docs.openclaw.ai/automation/webhook); [Gmail Pub/Sub](https://docs.openclaw.ai/automation/gmail-pubsub)。
- **[技能平台](https://docs.openclaw.ai/tools/skills)**: 绑定、托管和工作区技能，支持安装门控 + UI。

## 运行原理 (简述)

```
WhatsApp / Telegram / Slack / Discord / Google Chat / Signal / iMessage / BlueBubbles / Microsoft Teams / Matrix / Zalo / Zalo Personal / WebChat
               │
               ▼
┌───────────────────────────────┐
│            Gateway            │
│       (control plane)         │
│     ws://127.0.0.1:18789      │
└──────────────┬────────────────┘
               │
               ├─ Pi agent (RPC)
               ├─ CLI (openclaw …)
               ├─ WebChat UI
               ├─ macOS app
               └─ iOS / Android nodes
```

## Tailscale 访问 (网关仪表盘)

OpenClaw 可以自动配置 Tailscale **Serve** (仅限 tailnet) 或 **Funnel** (公开访问)，同时保持 Gateway 绑定在 loopback。配置 `gateway.tailscale.mode`:

- `off`: 不使用 Tailscale 自动化 (默认)。
- `serve`: 通过 `tailscale serve` 提供 tailnet-only HTTPS (默认使用 Tailscale 身份头)。
- `funnel`: 通过 `tailscale funnel` 提供公共 HTTPS (需要共享密码认证)。

详情: [Tailscale 指南](https://docs.openclaw.ai/gateway/tailscale) · [Web 界面](https://docs.openclaw.ai/web)

## 远程网关 (Linux 最佳拍档)

在小型 Linux 实例上运行 Gateway 是绝佳选择。客户端 (macOS app, CLI, WebChat) 可以通过 **Tailscale Serve/Funnel** 或 **SSH 隧道** 连接。

- **Gateway 主机** 默认运行 exec 工具和渠道连接。
- **设备节点 (Device nodes)** 运行设备本地操作 (`system.run`, 摄像头, 屏幕录制)。

简单来说：exec 在 Gateway 所在处运行；设备操作在设备所在处运行。

详情: [远程访问](https://docs.openclaw.ai/gateway/remote) · [节点](https://docs.openclaw.ai/nodes)

## 常用聊天指令

在 WhatsApp/Telegram/Slack 等渠道中发送 (群组指令仅限所有者):

- `/status` — 紧凑的会话状态 (模型 + Token + 成本)
- `/new` 或 `/reset` — 重置会话
- `/compact` — 压缩会话上下文 (摘要)
- `/think <level>` — off|minimal|low|medium|high|xhigh (仅限推理模型)
- `/verbose on|off` — 详细模式开关
- `/usage off|tokens|full` — 每次回复显示用量页脚
- `/restart` — 重启网关 (群组所有者专用)
- `/activation mention|always` — 群组激活模式切换

## 配置示例

最小化 `~/.openclaw/openclaw.json` (模型 + 默认值):

```json5
{
  agent: {
    model: "deepseek/deepseek-chat" // 或 "anthropic/claude-opus-4-5"
  }
}
```

[完整配置参考 (所有键值 + 示例)](https://docs.openclaw.ai/gateway/configuration)

## 📚 更多文档 (More Documentation)

### 进阶与运维
- [架构概览](https://docs.openclaw.ai/concepts/architecture) · [协议与发现](https://docs.openclaw.ai/gateway/discovery) · [Bonjour/mDNS](https://docs.openclaw.ai/gateway/bonjour)
- [网关配对](https://docs.openclaw.ai/gateway/pairing) · [健康检查](https://docs.openclaw.ai/gateway/health) · [后台进程](https://docs.openclaw.ai/gateway/background-process)
- [日志记录](https://docs.openclaw.ai/logging) · [故障排除](https://docs.openclaw.ai/channels/troubleshooting)

### 深度解析 (Deep Dives)
- [Agent 循环](https://docs.openclaw.ai/concepts/agent-loop) · [Presence 机制](https://docs.openclaw.ai/concepts/presence) · [队列系统](https://docs.openclaw.ai/concepts/queue)
- [TypeBox Schemas](https://docs.openclaw.ai/concepts/typebox) · [RPC 适配器](https://docs.openclaw.ai/reference/rpc)

### 平台内部原理
- [macOS 开发设置](https://docs.openclaw.ai/platforms/mac/dev-setup) · [菜单栏实现](https://docs.openclaw.ai/platforms/mac/menu-bar)
- [Windows (WSL2)](https://docs.openclaw.ai/platforms/windows) · [Linux App](https://docs.openclaw.ai/platforms/linux)

### 模板与参考
- [默认 AGENTS](https://docs.openclaw.ai/reference/AGENTS.default) · [技能配置](https://docs.openclaw.ai/tools/skills-config)
- 模板: [BOOTSTRAP](https://docs.openclaw.ai/reference/templates/BOOTSTRAP) · [IDENTITY](https://docs.openclaw.ai/reference/templates/IDENTITY) · [SOUL](https://docs.openclaw.ai/reference/templates/SOUL)

---

## Molty

OpenClaw 最初是为 **Molty** 打造的，一只太空龙虾 AI 助手。🦞
由 Peter Steinberger 和社区共同构建。

- [openclaw.ai](https://openclaw.ai)
- [soul.md](https://soul.md)
- [steipete.me](https://steipete.me)
- [@openclaw](https://x.com/openclaw)

## 社区与贡献

查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解指南、维护者以及如何提交 PR。
欢迎 AI/vibe-coded PRs! 🤖

特别感谢 [Mario Zechner](https://mariozechner.at/) 的支持以及 [pi-mono](https://github.com/badlogic/pi-mono)。
特别感谢 Adam Doppelt 的 lobster.bot。

感谢所有贡献者 (Clawtributors):

<p align="left">
  <a href="https://github.com/steipete"><img src="https://avatars.githubusercontent.com/u/58493?v=4&s=48" width="48" height="48" alt="steipete" title="steipete"/></a> <a href="https://github.com/plum-dawg"><img src="https://avatars.githubusercontent.com/u/5909950?v=4&s=48" width="48" height="48" alt="plum-dawg" title="plum-dawg"/></a> <a href="https://github.com/bohdanpodvirnyi"><img src="https://avatars.githubusercontent.com/u/31819391?v=4&s=48" width="48" height="48" alt="bohdanpodvirnyi" title="bohdanpodvirnyi"/></a> <a href="https://github.com/iHildy"><img src="https://avatars.githubusercontent.com/u/25069719?v=4&s=48" width="48" height="48" alt="iHildy" title="iHildy"/></a> <a href="https://github.com/jaydenfyi"><img src="https://avatars.githubusercontent.com/u/213395523?v=4&s=48" width="48" height="48" alt="jaydenfyi" title="jaydenfyi"/></a> <a href="https://github.com/joaohlisboa"><img src="https://avatars.githubusercontent.com/u/8200873?v=4&s=48" width="48" height="48" alt="joaohlisboa" title="joaohlisboa"/></a> <a href="https://github.com/mneves75"><img src="https://avatars.githubusercontent.com/u/2423436?v=4&s=48" width="48" height="48" alt="mneves75" title="mneves75"/></a> <a href="https://github.com/MatthieuBizien"><img src="https://avatars.githubusercontent.com/u/173090?v=4&s=48" width="48" height="48" alt="MatthieuBizien" title="MatthieuBizien"/></a> <a href="https://github.com/MaudeBot"><img src="https://avatars.githubusercontent.com/u/255777700?v=4&s=48" width="48" height="48" alt="MaudeBot" title="MaudeBot"/></a> <a href="https://github.com/Glucksberg"><img src="https://avatars.githubusercontent.com/u/80581902?v=4&s=48" width="48" height="48" alt="Glucksberg" title="Glucksberg"/></a>
  <a href="https://github.com/rahthakor"><img src="https://avatars.githubusercontent.com/u/8470553?v=4&s=48" width="48" height="48" alt="rahthakor" title="rahthakor"/></a> <a href="https://github.com/vrknetha"><img src="https://avatars.githubusercontent.com/u/20596261?v=4&s=48" width="48" height="48" alt="vrknetha" title="vrknetha"/></a> <a href="https://github.com/radek-paclt"><img src="https://avatars.githubusercontent.com/u/50451445?v=4&s=48" width="48" height="48" alt="radek-paclt" title="radek-paclt"/></a> <a href="https://github.com/vignesh07"><img src="https://avatars.githubusercontent.com/u/1436853?v=4&s=48" width="48" height="48" alt="vignesh07" title="vignesh07"/></a> <a href="https://github.com/tobiasbischoff"><img src="https://avatars.githubusercontent.com/u/711564?v=4&s=48" width="48" height="48" alt="Tobias Bischoff" title="Tobias Bischoff"/></a> <a href="https://github.com/joshp123"><img src="https://avatars.githubusercontent.com/u/1497361?v=4&s=48" width="48" height="48" alt="joshp123" title="joshp123"/></a> <a href="https://github.com/czekaj"><img src="https://avatars.githubusercontent.com/u/1464539?v=4&s=48" width="48" height="48" alt="czekaj" title="czekaj"/></a> <a href="https://github.com/mukhtharcm"><img src="https://avatars.githubusercontent.com/u/56378562?v=4&s=48" width="48" height="48" alt="mukhtharcm" title="mukhtharcm"/></a> <a href="https://github.com/sebslight"><img src="https://avatars.githubusercontent.com/u/19554889?v=4&s=48" width="48" height="48" alt="sebslight" title="sebslight"/></a> <a href="https://github.com/maxsumrall"><img src="https://avatars.githubusercontent.com/u/628843?v=4&s=48" width="48" height="48" alt="maxsumrall" title="maxsumrall"/></a>
  <a href="https://github.com/xadenryan"><img src="https://avatars.githubusercontent.com/u/165437834?v=4&s=48" width="48" height="48" alt="xadenryan" title="xadenryan"/></a> <a href="https://github.com/rodrigouroz"><img src="https://avatars.githubusercontent.com/u/384037?v=4&s=48" width="48" height="48" alt="rodrigouroz" title="rodrigouroz"/></a> <a href="https://github.com/juanpablodlc"><img src="https://avatars.githubusercontent.com/u/92012363?v=4&s=48" width="48" height="48" alt="juanpablodlc" title="juanpablodlc"/></a> <a href="https://github.com/hsrvc"><img src="https://avatars.githubusercontent.com/u/129702169?v=4&s=48" width="48" height="48" alt="hsrvc" title="hsrvc"/></a> <a href="https://github.com/magimetal"><img src="https://avatars.githubusercontent.com/u/36491250?v=4&s=48" width="48" height="48" alt="magimetal" title="magimetal"/></a> <a href="https://github.com/zerone0x"><img src="https://avatars.githubusercontent.com/u/39543393?v=4&s=48" width="48" height="48" alt="zerone0x" title="zerone0x"/></a> <a href="https://github.com/tyler6204"><img src="https://avatars.githubusercontent.com/u/64381258?v=4&s=48" width="48" height="48" alt="tyler6204" title="tyler6204"/></a> <a href="https://github.com/meaningfool"><img src="https://avatars.githubusercontent.com/u/2862331?v=4&s=48" width="48" height="48" alt="meaningfool" title="meaningfool"/></a> <a href="https://github.com/patelhiren"><img src="https://avatars.githubusercontent.com/u/172098?v=4&s=48" width="48" height="48" alt="patelhiren" title="patelhiren"/></a> <a href="https://github.com/NicholasSpisak"><img src="https://avatars.githubusercontent.com/u/129075147?v=4&s=48" width="48" height="48" alt="NicholasSpisak" title="NicholasSpisak"/></a>
</p>
