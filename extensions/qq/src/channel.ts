import {
  buildChannelConfigSchema,
  DEFAULT_ACCOUNT_ID,
  type ChannelPlugin,
  type OpenClawConfig,
  type ChannelOutboundContext,
} from "openclaw/plugin-sdk";
import { QQConfigSchema } from "./config-schema.js";
import { QQClient } from "./api.js";
import { ResolvedQQAccount, QQConfig } from "./types.js";

// Global map to hold active clients
const clients = new Map<string, QQClient>();

const meta = {
  id: "qq",
  label: "QQ",
  selectionLabel: "QQ Bot",
  detailLabel: "QQ Official Bot",
  docsPath: "/channels/qq",
  docsLabel: "qq",
  blurb: "QQ Official Bot integration.",
  systemImage: "penguin.fill", // hypothetical SF Symbol
};

function resolveQQAccount(params: { cfg: OpenClawConfig; accountId?: string }): ResolvedQQAccount {
  const { cfg, accountId = DEFAULT_ACCOUNT_ID } = params;
  const qqConfig = (cfg.channels?.qq ?? {}) as QQConfig;
  const accountConfig =
    accountId === DEFAULT_ACCOUNT_ID
      ? qqConfig
      : qqConfig.accounts?.[accountId];

  return {
    accountId,
    name: accountConfig?.name ?? "QQ Bot",
    enabled: accountConfig?.enabled ?? true,
    config: accountConfig ?? {},
    appId: accountConfig?.appId ?? process.env.QQ_APP_ID,
    token: accountConfig?.token ?? process.env.QQ_TOKEN,
    clientSecret: accountConfig?.clientSecret ?? process.env.QQ_CLIENT_SECRET,
    sandbox: accountConfig?.sandbox ?? false,
    tokenSource: (accountConfig?.token || process.env.QQ_TOKEN) ? "config" : "none",
  };
}

export const qqPlugin: ChannelPlugin<ResolvedQQAccount> = {
  id: "qq",
  meta: {
    ...meta,
    quickstartAllowFrom: true,
  },
  pairing: {
    idLabel: "qqUserId",
    normalizeAllowEntry: (entry: string) => entry.replace(/^qq:/i, ""),
    notifyApproval: async () => {},
  },
  capabilities: {
    chatTypes: ["group", "direct"],
    reactions: false,
    threads: false,
    media: false, // For now
    nativeCommands: false,
    blockStreaming: false,
  },
  reload: { configPrefixes: ["channels.qq"] },
  configSchema: buildChannelConfigSchema(QQConfigSchema),
  config: {
    listAccountIds: (cfg: OpenClawConfig) => {
      const ids = new Set<string>();
      const qqConfig = (cfg.channels?.qq ?? {}) as QQConfig;
      if (qqConfig.appId || process.env.QQ_APP_ID) ids.add(DEFAULT_ACCOUNT_ID);
      if (qqConfig.accounts) Object.keys(qqConfig.accounts).forEach(id => ids.add(id));
      return Array.from(ids);
    },
    resolveAccount: (cfg: OpenClawConfig, accountId: string) => resolveQQAccount({ cfg, accountId }),
    defaultAccountId: () => DEFAULT_ACCOUNT_ID,
    setAccountEnabled: ({ cfg, accountId, enabled }: any) => cfg, // simplified
    deleteAccount: ({ cfg, accountId }: any) => cfg, // simplified
    isConfigured: (account: ResolvedQQAccount) => Boolean(account.appId && account.token),
    describeAccount: (account: ResolvedQQAccount) => ({
      accountId: account.accountId,
      name: account.name,
      enabled: account.enabled,
      configured: Boolean(account.appId && account.token),
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
    resolveRequireMention: () => true, // Bots usually require mention
  },
  messaging: {
    normalizeTarget: (t: string) => t.replace(/^qq:/i, ""),
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
    sendPayload: async ({ to, payload, accountId, cfg }: ChannelOutboundContext<ResolvedQQAccount>) => {
      const client = clients.get(accountId || DEFAULT_ACCOUNT_ID);
      if (!client) return { channel: "qq", messageId: "error", error: "Client not connected" };
      
      const text = payload.text || "";
      // Heuristic to detect Guild vs Group vs DM
      // Real implementation needs to store context about 'to' (is it a guild channel or a group?)
      // For now, assume if it looks like a Guild Channel ID vs Group OpenID.
      // Or rely on reply context which we don't have here easily.
      
      // Attempt to send as Guild Message by default if 'to' is long?
      // Or maybe we just fail for now if we don't know type.
      // But let's try sending as Guild Channel Message first.
      
      try {
        await client.sendGuildMessage(to, text);
        return { channel: "qq", messageId: "sent", chatId: to };
      } catch (e) {
        // Fallback to Group?
        try {
          await client.sendGroupMessage(to, text);
          return { channel: "qq", messageId: "sent", chatId: to };
        } catch (e2) {
           return { channel: "qq", messageId: "error", error: "Failed to send" };
        }
      }
    },
    sendText: async ({ to, text, accountId }: ChannelOutboundContext<ResolvedQQAccount>) => {
       const client = clients.get(accountId || DEFAULT_ACCOUNT_ID);
       if (!client) return { channel: "qq", messageId: "error", error: "Client not connected" };
       await client.sendGuildMessage(to, text);
       return { channel: "qq", messageId: "sent", chatId: to };
    },
    sendMedia: async () => ({
      channel: "qq",
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
      mode: "websocket",
      lastError: snapshot.lastError ?? null,
    }),
    probeAccount: async () => true,
    buildAccountSnapshot: ({ account, runtime }: { account: ResolvedQQAccount; runtime: any }) => ({
      accountId: account.accountId,
      name: account.name,
      enabled: account.enabled,
      configured: Boolean(account.appId),
      tokenSource: account.tokenSource,
      running: runtime?.running ?? false,
      lastStartAt: runtime?.lastStartAt ?? null,
      lastStopAt: runtime?.lastStopAt ?? null,
      lastError: runtime?.lastError ?? null,
      mode: "websocket",
    }),
  },
  gateway: {
    startAccount: async (ctx: any) => {
      const account = ctx.account as ResolvedQQAccount;
      if (!account.appId || !account.token) throw new Error("QQ AppID/Token missing");
      
      const client = new QQClient(account, ctx.runtime, (payload) => {
        // Handle Inbound
        const { type, content, author, channel_id, group_openid, id } = payload;
        const text = content?.trim() || "";
        const fromId = author?.id || payload.author?.member_openid; 
        const fromName = author?.username || "User";
        
        // Determine chatId
        let chatId = channel_id;
        if (type === "group") chatId = group_openid;
        if (type === "c2c") chatId = author?.user_openid; // ?
        
        if (text) {
          ctx.runtime.ingest.text({
            text,
            channel: "qq",
            from: { id: fromId, name: fromName },
            to: { id: chatId },
            metadata: {
              accountId: account.accountId,
              msgId: id
            }
          });
        }
      });
      
      await client.connect();
      clients.set(account.accountId, client);
      
      // Keep alive
      return new Promise<void>((resolve) => {
        ctx.abortSignal?.addEventListener("abort", () => {
           // disconnect
           clients.delete(account.accountId);
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
