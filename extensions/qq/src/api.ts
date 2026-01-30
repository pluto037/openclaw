import axios from "axios";
import WebSocket from "ws";
import type { PluginRuntime } from "openclaw/plugin-sdk";
import { ResolvedQQAccount } from "./types.js";

const API_BASE_PROD = "https://api.sgroup.qq.com";
const API_BASE_SANDBOX = "https://sandbox.api.sgroup.qq.com";

export class QQClient {
  private ws: WebSocket | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private sequence: number | null = null;
  private sessionId: string | null = null;
  private baseUrl: string;

  constructor(
    private account: ResolvedQQAccount,
    private runtime: PluginRuntime,
    private onMessage: (payload: any) => void
  ) {
    this.baseUrl = account.sandbox ? API_BASE_SANDBOX : API_BASE_PROD;
  }

  async connect() {
    try {
      // 1. Get Gateway URL
      const res = await axios.get(`${this.baseUrl}/gateway`, {
        headers: {
          Authorization: `Bot ${this.account.appId}.${this.account.token}`
        }
      });
      
      const gatewayUrl = res.data.url;
      this.runtime.logger.info(`[QQ] Connecting to gateway: ${gatewayUrl}`);

      this.ws = new WebSocket(gatewayUrl);

      this.ws.on("open", () => {
        this.runtime.logger.info("[QQ] WebSocket connected");
      });

      this.ws.on("message", (data) => {
        const payload = JSON.parse(data.toString());
        this.handlePayload(payload);
      });

      this.ws.on("close", (code, reason) => {
        this.runtime.logger.warn(`[QQ] WebSocket closed: ${code} ${reason}`);
        this.cleanup();
        // Reconnect logic should be handled by caller or here
        setTimeout(() => this.connect(), 5000);
      });

      this.ws.on("error", (err) => {
        this.runtime.logger.error(`[QQ] WebSocket error: ${err}`);
      });

    } catch (err) {
      this.runtime.logger.error(`[QQ] Connect failed: ${err}`);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private handlePayload(payload: any) {
    if (payload.s) {
      this.sequence = payload.s;
    }

    switch (payload.op) {
      case 10: // Hello
        const heartbeatIntervalMs = payload.d.heartbeat_interval;
        this.startHeartbeat(heartbeatIntervalMs);
        this.identify();
        break;
      case 0: // Dispatch
        this.handleEvent(payload);
        break;
      case 11: // Heartbeat ACK
        // createLog logic
        break;
    }
  }

  private startHeartbeat(interval: number) {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          op: 1,
          d: this.sequence
        }));
      }
    }, interval);
  }

  private identify() {
    const intents = (1 << 0) | (1 << 1) | (1 << 9) | (1 << 12) | (1 << 30); 
    // GUILDS (1<<0), GUILD_MEMBERS (1<<1), GUILD_MESSAGES (1<<9), DIRECT_MESSAGE (1<<12), MESSAGE_AUDIT (1<<27)? 
    // Public guild messages (1<<30) - if intent is open.
    // For now use basic intents.
    // Official doc recommends calculating needed intents.
    // 0: GUILDS
    // 1: GUILD_MEMBERS
    // 9: GUILD_MESSAGES
    // 10: GUILD_MESSAGE_REACTIONS
    // 12: DIRECT_MESSAGE
    // 25: GROUP_AT_MESSAGES (Group chat)
    // 26: C2C_MESSAGE (Private chat)
    
    // We try to enable GUILD_MESSAGES and DIRECT_MESSAGE and GROUP_AT_MESSAGES
    
    const intent = (1 << 0) | (1 << 9) | (1 << 12) | (1 << 25);

    const payload = {
      op: 2,
      d: {
        token: `Bot ${this.account.appId}.${this.account.token}`,
        intents: intent,
        shard: [0, 1], // Single shard for now
        properties: {
          $os: process.platform,
          $browser: "openclaw",
          $device: "openclaw"
        }
      }
    };
    this.ws?.send(JSON.stringify(payload));
  }

  private handleEvent(payload: any) {
    const { t, d } = payload;
    if (t === "READY") {
      this.sessionId = d.session_id;
      this.runtime.logger.info(`[QQ] Bot ready: ${d.user.username} (${d.user.id})`);
    } else if (t === "AT_MESSAGE_CREATE" || t === "MESSAGE_CREATE") {
      this.onMessage({ type: "guild", ...d });
    } else if (t === "DIRECT_MESSAGE_CREATE") {
      this.onMessage({ type: "dm", ...d });
    } else if (t === "GROUP_AT_MESSAGE_CREATE") {
      this.onMessage({ type: "group", ...d });
    } else if (t === "C2C_MESSAGE_CREATE") {
      this.onMessage({ type: "c2c", ...d });
    }
  }

  private cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.ws = null;
  }

  async sendGuildMessage(channelId: string, content: string, msgId?: string) {
    const url = `${this.baseUrl}/channels/${channelId}/messages`;
    await axios.post(url, {
      content,
      msg_id: msgId 
    }, {
      headers: {
        Authorization: `Bot ${this.account.appId}.${this.account.token}`
      }
    });
  }

  async sendDirectMessage(guildId: string, content: string, msgId?: string) {
    // DM needs to create a DM channel first usually, or reply to existing
    // For simplicity, assume we reply to dms sent to us.
    // Official API: POST /dms/{guild_id}/messages
    const url = `${this.baseUrl}/dms/${guildId}/messages`;
    await axios.post(url, {
      content,
      msg_id: msgId
    }, {
      headers: {
        Authorization: `Bot ${this.account.appId}.${this.account.token}`
      }
    });
  }
  
  async sendGroupMessage(groupId: string, content: string, msgId?: string) {
    // v2 API for Group
    const url = `${this.baseUrl}/v2/groups/${groupId}/messages`;
    await axios.post(url, {
      content,
      msg_id: msgId,
      msg_type: 0 // Text
    }, {
      headers: {
        Authorization: `Bot ${this.account.appId}.${this.account.token}`
      }
    });
  }
}
