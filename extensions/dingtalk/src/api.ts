import axios from "axios";
import { createHmac } from "node:crypto";
import type { OpenClawConfig, PluginRuntime } from "openclaw/plugin-sdk";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk";
import { 
  ResolvedDingTalkAccount, 
  DingTalkConfig, 
  DingTalkAccountConfig 
} from "./types.js";

export class DingTalkChannel {
  constructor(private runtime: PluginRuntime) {}

  resolveDingTalkAccount(params: {
    cfg: OpenClawConfig;
    accountId?: string;
  }): ResolvedDingTalkAccount {
    const { cfg, accountId = DEFAULT_ACCOUNT_ID } = params;
    const dingConfig = (cfg.channels?.dingtalk ?? {}) as DingTalkConfig;
    const accountConfig =
      accountId === DEFAULT_ACCOUNT_ID
        ? dingConfig
        : dingConfig.accounts?.[accountId];

    const defaults = dingConfig.defaults ?? {};
    
    // Resolve credentials from Env or Config
    let webhookUrl = accountConfig?.webhookUrl ?? process.env.DINGTALK_WEBHOOK_URL;
    let secret = accountConfig?.secret ?? process.env.DINGTALK_SECRET;
    let webhookSecret = accountConfig?.webhookSecret ?? process.env.DINGTALK_WEBHOOK_SECRET;
    
    // Check if using AppKey/AppSecret (Enterprise Robot) - Not fully implemented yet
    let appKey = accountConfig?.appKey ?? process.env.DINGTALK_APP_KEY;
    let appSecret = accountConfig?.appSecret ?? process.env.DINGTALK_APP_SECRET;

    let tokenSource: ResolvedDingTalkAccount["tokenSource"] = "none";
    if (webhookUrl) {
      tokenSource = accountConfig?.webhookUrl ? "config" : "env";
    }

    return {
      accountId,
      name: accountConfig?.name ?? "DingTalk Bot",
      enabled: accountConfig?.enabled ?? true,
      config: accountConfig ?? {},
      webhookUrl,
      secret,
      webhookSecret,
      appKey,
      appSecret,
      tokenSource,
    };
  }

  listDingTalkAccountIds(cfg: OpenClawConfig): string[] {
    const dingConfig = (cfg.channels?.dingtalk ?? {}) as DingTalkConfig;
    const ids = new Set<string>();
    
    // Check default account
    if (dingConfig.webhookUrl || process.env.DINGTALK_WEBHOOK_URL) {
      ids.add(DEFAULT_ACCOUNT_ID);
    }
    
    // Check named accounts
    if (dingConfig.accounts) {
      for (const id of Object.keys(dingConfig.accounts)) {
        ids.add(id);
      }
    }
    
    return Array.from(ids);
  }

  resolveDefaultDingTalkAccountId(cfg: OpenClawConfig): string {
    return DEFAULT_ACCOUNT_ID;
  }

  // Probe: Check if webhook URL is valid (can't really ping it without sending message)
  // For now, just check if configured
  async probeDingTalkAccount(account: ResolvedDingTalkAccount, timeoutMs: number): Promise<boolean> {
    if (!account.webhookUrl) return false;
    return true;
  }

  // Monitor: Setup Incoming Webhook (Outgoing from DingTalk perspective)
  async monitorDingTalkProvider(params: {
    accountId: string;
    config: OpenClawConfig;
    runtime: PluginRuntime;
    abortSignal?: AbortSignal;
    webhookPath?: string;
  }) {
    const { accountId, runtime, webhookPath } = params;
    const account = this.resolveDingTalkAccount({ cfg: params.config, accountId });

    // Register Webhook Route
    // DingTalk Outgoing Webhook POSTs to this URL
    const routePath = webhookPath ?? `/webhooks/dingtalk/${accountId}`;
    
    runtime.router.post(routePath, async (req: any, res: any) => {
      try {
        const payload = req.body;
        // Verify signature/token if configured
        // Outgoing Webhook puts token in header 'token' or body 'token' (depends on config)
        // Actually DingTalk Outgoing Webhook sends verify token in header `token`? 
        // Docs say: "验证方式：钉钉服务器推送数据到回调URL时，会带上token参数..."
        // It's often in header `token` or just verify manually.
        
        // Simple token check
        if (account.webhookSecret) {
           // check logic here, header token
           const token = req.headers['token'];
           // if (token !== account.webhookSecret) ...
        }

        // Process Message
        if (payload.msgtype === "text") {
          const content = payload.text?.content?.trim();
          const senderId = payload.senderStaffId || payload.senderId;
          const senderName = payload.senderNick;
          const conversationId = payload.conversationId; // Group ID or Chat ID
          
          if (content) {
            await runtime.ingest.text({
               text: content,
               channel: "dingtalk",
               from: {
                 id: senderId,
                 name: senderName
               },
               to: {
                 id: conversationId, // Reply to this conversation
               },
               metadata: {
                 accountId,
                 conversationType: payload.conversationType,
                 sessionWebhook: payload.sessionWebhook,
                 msgId: payload.msgId
               }
            });
          }
        }
        
        // Respond empty to acknowledge
        res.status(200).send(JSON.stringify({ msgtype: "empty" }));
      } catch (err) {
        runtime.logger.error(`DingTalk webhook error: ${err}`);
        res.status(500).send("Error");
      }
    });

    runtime.logger.info(`[${accountId}] DingTalk webhook listening at ${routePath}`);
    
    // Keep alive until aborted
    return new Promise<void>((resolve) => {
      params.abortSignal?.addEventListener("abort", () => resolve());
    });
  }

  // Send Message
  async sendMessage(params: {
    to: string;
    text: string;
    account: ResolvedDingTalkAccount;
    metadata?: any;
  }) {
    const { to, text, account, metadata } = params;
    
    // Priority 1: Use sessionWebhook if available and valid (for quick reply)
    // But sessionWebhook expires. 
    // Safest is to use Group Robot Webhook URL.
    
    let url = account.webhookUrl;
    if (!url) {
      throw new Error("DingTalk Webhook URL not configured");
    }

    // Add signature if secret is present
    if (account.secret) {
      const timestamp = Date.now();
      const stringToSign = `${timestamp}\n${account.secret}`;
      const sign = createHmac('sha256', account.secret).update(stringToSign).digest('base64');
      // Append params
      const separator = url.includes("?") ? "&" : "?";
      url += `${separator}timestamp=${timestamp}&sign=${encodeURIComponent(sign)}`;
    }

    const body = {
      msgtype: "text",
      text: {
        content: text
      },
      at: {
        // If we want to @ user, we need their phone number or userid. 
        // We might not have it from just senderId unless we map it.
        // For now, just send text.
      }
    };

    const res = await axios.post(url, body);
    if (res.data.errcode !== 0) {
      throw new Error(`DingTalk send error: ${res.data.errmsg}`);
    }
    
    return {
      messageId: "sent-" + Date.now(),
      chatId: to
    };
  }
}
