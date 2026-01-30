import axios from "axios";
import type { PluginRuntime } from "openclaw/plugin-sdk";
import { ResolvedFeishuAccount } from "./types.js";

const API_BASE = "https://open.feishu.cn/open-apis";

export class FeishuClient {
  private tenantAccessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(
    private account: ResolvedFeishuAccount,
    private runtime: PluginRuntime
  ) {}

  private async getTenantAccessToken() {
    if (this.tenantAccessToken && Date.now() < this.tokenExpiresAt) {
      return this.tenantAccessToken;
    }

    try {
      const res = await axios.post(`${API_BASE}/auth/v3/tenant_access_token/internal`, {
        app_id: this.account.appId,
        app_secret: this.account.appSecret
      });

      if (res.data.code !== 0) {
        throw new Error(`Feishu auth failed: ${res.data.msg}`);
      }

      this.tenantAccessToken = res.data.tenant_access_token;
      // Expires in 7200 seconds, refresh 5 minutes early
      this.tokenExpiresAt = Date.now() + (res.data.expire - 300) * 1000;
      return this.tenantAccessToken;
    } catch (err) {
      this.runtime.logger.error(`[Feishu] Get token error: ${err}`);
      throw err;
    }
  }

  async sendMessage(params: {
    receive_id: string;
    receive_id_type: "open_id" | "user_id" | "union_id" | "email" | "chat_id";
    content: string; // JSON string
    msg_type: "text" | "post" | "image" | "interactive";
  }) {
    const token = await this.getTenantAccessToken();
    const url = `${API_BASE}/im/v1/messages?receive_id_type=${params.receive_id_type}`;
    
    try {
      const res = await axios.post(url, {
        receive_id: params.receive_id,
        content: params.content,
        msg_type: params.msg_type
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.code !== 0) {
        throw new Error(`Feishu send error: ${res.data.msg}`);
      }
      return res.data.data;
    } catch (err) {
      this.runtime.logger.error(`[Feishu] Send message error: ${err}`);
      throw err;
    }
  }

  async handleWebhook(req: any, res: any) {
    // Challenge check (First time verification)
    if (req.body.type === "url_verification") {
      if (req.body.token !== this.account.verificationToken) {
        return res.status(403).send("Verification token mismatch");
      }
      return res.status(200).json({ challenge: req.body.challenge });
    }

    // Encrypt check (TODO: implement decryption if encryptKey is set)
    // if (this.account.encryptKey) { ... }

    // Event handling
    const event = req.body.event;
    if (req.body.header?.event_type === "im.message.receive_v1") {
      const message = event.message;
      const sender = event.sender;
      
      const content = JSON.parse(message.content);
      const text = content.text || ""; // Only handle text for now

      if (text) {
        // Chat type: p2p (private), group (group)
        const chatId = message.chat_id;
        const chatType = message.chat_type; // "p2p", "group"
        const senderId = sender.sender_id.open_id; // Default to open_id
        
        // In OpenClaw, 'to' is usually the conversation ID
        // For p2p, it might be senderId, but Feishu uses chat_id for both.
        
        await this.runtime.ingest.text({
          text,
          channel: "feishu",
          from: {
            id: senderId,
            name: sender.sender_id.user_id || "User" // user_id might be hidden
          },
          to: {
            id: chatId
          },
          metadata: {
            accountId: this.account.accountId,
            msgId: message.message_id,
            chatType
          }
        });
      }
    }

    res.status(200).send("OK");
  }
}
