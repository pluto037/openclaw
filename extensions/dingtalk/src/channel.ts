import {
  buildChannelConfigSchema,
  DEFAULT_ACCOUNT_ID,
  type ChannelPlugin,
  type OpenClawConfig,
  type ChannelOutboundContext,
} from "openclaw/plugin-sdk";
import { DingTalkConfigSchema } from "./config-schema.js";
import { getDingTalkRuntime } from "./runtime.js";
import { ResolvedDingTalkAccount, DingTalkConfig } from "./types.js";

const meta = {
  id: "dingtalk",
  label: "DingTalk",
  selectionLabel: "DingTalk (Webhook)",
  detailLabel: "DingTalk Bot",
  docsPath: "/channels/dingtalk",
  docsLabel: "dingtalk",
  blurb: "DingTalk Group Robot and Enterprise Bot integration.",
  systemImage: "bubble.left.and.bubble.right.fill",
};

export const dingTalkPlugin: ChannelPlugin<ResolvedDingTalkAccount> = {
  id: "dingtalk",
  meta: {
    ...meta,
    quickstartAllowFrom: true,
  },
  pairing: {
    idLabel: "dingtalkUserId",
    normalizeAllowEntry: (entry: string) => entry.replace(/^dingtalk:/i, ""),
    notifyApproval: async () => {
      // Notification not implemented for simple webhook
    },
  },
  capabilities: {
    chatTypes: ["group"],
    reactions: false,
    threads: false,
    media: false,
    nativeCommands: false,
    blockStreaming: false,
  },
  reload: { configPrefixes: ["channels.dingtalk"] },
  configSchema: buildChannelConfigSchema(DingTalkConfigSchema),
  config: {
    listAccountIds: (cfg: OpenClawConfig) => getDingTalkRuntime().channel.dingtalk.listDingTalkAccountIds(cfg),
    resolveAccount: (cfg: OpenClawConfig, accountId: string) =>
      getDingTalkRuntime().channel.dingtalk.resolveDingTalkAccount({ cfg, accountId }),
    defaultAccountId: (cfg: OpenClawConfig) =>
      getDingTalkRuntime().channel.dingtalk.resolveDefaultDingTalkAccountId(cfg),
    setAccountEnabled: ({ cfg, accountId, enabled }: { cfg: OpenClawConfig; accountId: string; enabled: boolean }) => {
      const dingConfig = (cfg.channels?.dingtalk ?? {}) as DingTalkConfig;
      if (accountId === DEFAULT_ACCOUNT_ID) {
        return {
          ...cfg,
          channels: {
            ...cfg.channels,
            dingtalk: {
              ...dingConfig,
              enabled,
            },
          },
        };
      }
      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          dingtalk: {
            ...dingConfig,
            accounts: {
              ...dingConfig.accounts,
              [accountId]: {
                ...dingConfig.accounts?.[accountId],
                enabled,
              },
            },
          },
        },
      };
    },
    deleteAccount: ({ cfg, accountId }: { cfg: OpenClawConfig; accountId: string }) => {
      const dingConfig = (cfg.channels?.dingtalk ?? {}) as DingTalkConfig;
      if (accountId === DEFAULT_ACCOUNT_ID) {
        const { webhookUrl, secret, webhookSecret, ...rest } = dingConfig;
        return {
          ...cfg,
          channels: {
            ...cfg.channels,
            dingtalk: rest,
          },
        };
      }
      const accounts = { ...dingConfig.accounts };
      delete accounts[accountId];
      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          dingtalk: {
            ...dingConfig,
            accounts: Object.keys(accounts).length > 0 ? accounts : undefined,
          },
        },
      };
    },
    isConfigured: (account: ResolvedDingTalkAccount) => Boolean(account.webhookUrl),
    describeAccount: (account: ResolvedDingTalkAccount) => ({
      accountId: account.accountId,
      name: account.name,
      enabled: account.enabled,
      configured: Boolean(account.webhookUrl),
      tokenSource: account.tokenSource,
    }),
    resolveAllowFrom: () => [],
    formatAllowFrom: () => [],
  },
  security: {
    resolveDmPolicy: () => ({
      policy: "open",
      allowFrom: [],
      policyPath: "",
      allowFromPath: "",
      approveHint: "",
      normalizeEntry: (s: string) => s,
    }),
    collectWarnings: () => [],
  },
  groups: {
    resolveRequireMention: () => false,
  },
  messaging: {
    normalizeTarget: (t: string) => t.replace(/^dingtalk:/i, ""),
    targetResolver: {
      looksLikeId: () => true,
      hint: "userId",
    },
  },
  directory: {
    self: async () => null,
    listPeers: async () => [],
    listGroups: async () => [],
  },
  setup: {
    resolveAccountId: ({ accountId }: { accountId: string }) => accountId,
    applyAccountName: ({ cfg }: { cfg: OpenClawConfig }) => cfg,
    validateInput: () => null,
    applyAccountConfig: ({ cfg }: { cfg: OpenClawConfig }) => cfg,
  },
  outbound: {
    deliveryMode: "direct",
    chunker: (text: string) => [text],
    textChunkLimit: 2000,
    sendPayload: async ({ to, payload, accountId, cfg }: ChannelOutboundContext<ResolvedDingTalkAccount>) => {
      const runtime = getDingTalkRuntime();
      const account = runtime.channel.dingtalk.resolveDingTalkAccount({ cfg, accountId });
      const text = payload.text || "";
      const result = await runtime.channel.dingtalk.sendMessage({
        to,
        text,
        account,
      });
      return { channel: "dingtalk", ...result };
    },
    sendText: async ({ to, text, accountId, cfg }: ChannelOutboundContext<ResolvedDingTalkAccount>) => {
      const runtime = getDingTalkRuntime();
      const account = runtime.channel.dingtalk.resolveDingTalkAccount({ cfg, accountId });
      const result = await runtime.channel.dingtalk.sendMessage({
        to,
        text,
        account,
      });
      return { channel: "dingtalk", ...result };
    },
    sendMedia: async () => ({
      channel: "dingtalk",
      messageId: "error",
      error: "Media not supported",
    }),
  },
  status: {
    defaultRuntime: {
      accountId: DEFAULT_ACCOUNT_ID,
      running: false,
      lastStartAt: null,
      lastStopAt: null,
      lastError: null,
    },
    collectStatusIssues: () => [],
    buildChannelSummary: ({ snapshot }: any) => ({
      configured: snapshot.configured ?? false,
      running: snapshot.running ?? false,
      tokenSource: snapshot.tokenSource ?? "none",
      mode: "webhook",
      lastError: snapshot.lastError ?? null,
    }),
    probeAccount: async ({ account }: { account: ResolvedDingTalkAccount }) =>
      getDingTalkRuntime().channel.dingtalk.probeDingTalkAccount(account, 1000),
    buildAccountSnapshot: ({ account, runtime }: { account: ResolvedDingTalkAccount; runtime: any }) => ({
      accountId: account.accountId,
      name: account.name,
      enabled: account.enabled,
      configured: Boolean(account.webhookUrl),
      tokenSource: account.tokenSource,
      running: runtime?.running ?? false,
      lastStartAt: runtime?.lastStartAt ?? null,
      lastStopAt: runtime?.lastStopAt ?? null,
      lastError: runtime?.lastError ?? null,
      mode: "webhook",
    }),
  },
  gateway: {
    startAccount: async (ctx: any) => {
      return getDingTalkRuntime().channel.dingtalk.monitorDingTalkProvider({
        accountId: ctx.account.accountId,
        config: ctx.cfg,
        runtime: ctx.runtime,
        abortSignal: ctx.abortSignal,
        webhookPath: ctx.account.config.webhookPath,
      });
    },
    logoutAccount: async () => {
      return { cleared: true, envToken: false, loggedOut: true };
    },
  },
  agentPrompt: {
    messageToolHints: () => [],
  },
};
