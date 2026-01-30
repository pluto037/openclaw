import {
  buildChannelConfigSchema,
  DEFAULT_ACCOUNT_ID,
  type ChannelPlugin,
  type OpenClawConfig,
  type ChannelOutboundContext,
} from "openclaw/plugin-sdk";
import { FeishuConfigSchema } from "./config-schema.js";
import { FeishuClient } from "./api.js";
import { getFeishuRuntime } from "./runtime.js";
import { ResolvedFeishuAccount, FeishuConfig } from "./types.js";

const meta = {
  id: "feishu",
  label: "Feishu",
  selectionLabel: "Feishu Bot",
  detailLabel: "Feishu / Lark",
  docsPath: "/channels/feishu",
  docsLabel: "feishu",
  blurb: "Feishu Open Platform integration.",
  systemImage: "paperplane.fill",
};

function resolveFeishuAccount(params: { cfg: OpenClawConfig; accountId?: string }): ResolvedFeishuAccount {
  const { cfg, accountId = DEFAULT_ACCOUNT_ID } = params;
  const feishuConfig = (cfg.channels?.feishu ?? {}) as FeishuConfig;
  const accountConfig =
    accountId === DEFAULT_ACCOUNT_ID
      ? feishuConfig
      : feishuConfig.accounts?.[accountId];

  return {
    accountId,
    name: accountConfig?.name ?? "Feishu Bot",
    enabled: accountConfig?.enabled ?? true,
    config: accountConfig ?? {},
    appId: accountConfig?.appId ?? process.env.FEISHU_APP_ID,
    appSecret: accountConfig?.appSecret ?? process.env.FEISHU_APP_SECRET,
    verificationToken: accountConfig?.verificationToken ?? process.env.FEISHU_VERIFICATION_TOKEN,
    encryptKey: accountConfig?.encryptKey ?? process.env.FEISHU_ENCRYPT_KEY,
    tokenSource: (accountConfig?.appId || process.env.FEISHU_APP_ID) ? "config" : "none",
  };
}

export const feishuPlugin: ChannelPlugin<ResolvedFeishuAccount> = {
  id: "feishu",
  meta: {
    ...meta,
    quickstartAllowFrom: true,
  },
  pairing: {
    idLabel: "feishuUserId",
    normalizeAllowEntry: (entry: string) => entry.replace(/^feishu:/i, ""),
    notifyApproval: async () => {},
  },
  capabilities: {
    chatTypes: ["group", "direct"],
    reactions: false,
    threads: false,
    media: false,
    nativeCommands: false,
    blockStreaming: false,
  },
  reload: { configPrefixes: ["channels.feishu"] },
  configSchema: buildChannelConfigSchema(FeishuConfigSchema),
  config: {
    listAccountIds: (cfg: OpenClawConfig) => {
      const ids = new Set<string>();
      const config = (cfg.channels?.feishu ?? {}) as FeishuConfig;
      if (config.appId || process.env.FEISHU_APP_ID) ids.add(DEFAULT_ACCOUNT_ID);
      if (config.accounts) Object.keys(config.accounts).forEach(id => ids.add(id));
      return Array.from(ids);
    },
    resolveAccount: (cfg: OpenClawConfig, accountId: string) => resolveFeishuAccount({ cfg, accountId }),
    defaultAccountId: () => DEFAULT_ACCOUNT_ID,
    setAccountEnabled: ({ cfg, accountId, enabled }: any) => cfg,
    deleteAccount: ({ cfg, accountId }: any) => cfg,
    isConfigured: (account: ResolvedFeishuAccount) => Boolean(account.appId && account.appSecret),
    describeAccount: (account: ResolvedFeishuAccount) => ({
      accountId: account.accountId,
      name: account.name,
      enabled: account.enabled,
      configured: Boolean(account.appId && account.appSecret),
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
    normalizeTarget: (t: string) => t.replace(/^feishu:/i, ""),
    targetResolver: {
      looksLikeId: () => true,
      hint: "chatId",
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
    sendPayload: async ({ to, payload, accountId, cfg }: ChannelOutboundContext<ResolvedFeishuAccount>) => {
      const runtime = getFeishuRuntime();
      const client = runtime.channel.feishu.clients.get(accountId || DEFAULT_ACCOUNT_ID);
      if (!client) return { channel: "feishu", messageId: "error", error: "Client not initialized" };
      
      const text = payload.text || "";
      try {
        const data = await client.sendMessage({
          receive_id: to,
          receive_id_type: "chat_id", // Default to chat_id (works for both group and p2p if obtained from webhook)
          content: JSON.stringify({ text }),
          msg_type: "text"
        });
        return { channel: "feishu", messageId: data.message_id, chatId: to };
      } catch (e: any) {
        return { channel: "feishu", messageId: "error", error: e.message };
      }
    },
    sendText: async ({ to, text, accountId }: ChannelOutboundContext<ResolvedFeishuAccount>) => {
       const runtime = getFeishuRuntime();
       const client = runtime.channel.feishu.clients.get(accountId || DEFAULT_ACCOUNT_ID);
       if (!client) return { channel: "feishu", messageId: "error", error: "Client not initialized" };
       
       try {
        const data = await client.sendMessage({
          receive_id: to,
          receive_id_type: "chat_id",
          content: JSON.stringify({ text }),
          msg_type: "text"
        });
        return { channel: "feishu", messageId: data.message_id, chatId: to };
      } catch (e: any) {
        return { channel: "feishu", messageId: "error", error: e.message };
      }
    },
    sendMedia: async () => ({
      channel: "feishu",
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
    probeAccount: async () => true,
    buildAccountSnapshot: ({ account, runtime }: { account: ResolvedFeishuAccount; runtime: any }) => ({
      accountId: account.accountId,
      name: account.name,
      enabled: account.enabled,
      configured: Boolean(account.appId),
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
      const account = ctx.account as ResolvedFeishuAccount;
      if (!account.appId || !account.appSecret) throw new Error("Feishu AppID/Secret missing");
      
      const client = new FeishuClient(account, ctx.runtime);
      getFeishuRuntime().channel.feishu.clients.set(account.accountId, client);

      // Register Webhook
      const routePath = account.config.webhookPath ?? `/webhooks/feishu/${account.accountId}`;
      ctx.runtime.router.post(routePath, (req: any, res: any) => client.handleWebhook(req, res));
      
      ctx.runtime.logger.info(`[${account.accountId}] Feishu webhook listening at ${routePath}`);

      return new Promise<void>((resolve) => {
        ctx.abortSignal?.addEventListener("abort", () => {
           getFeishuRuntime().channel.feishu.clients.delete(account.accountId);
           resolve();
        });
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
