import type {
  ChannelAccountConfig,
  ChannelConfig,
} from "openclaw/plugin-sdk";

export interface DingTalkAccountConfig extends ChannelAccountConfig {
  /**
   * DingTalk AppKey (Client ID) for Enterprise Internal Robot
   */
  appKey?: string;
  
  /**
   * DingTalk AppSecret (Client Secret) for Enterprise Internal Robot
   */
  appSecret?: string;
  
  /**
   * AgentId of the application
   */
  agentId?: string;
  
  /**
   * Verification Token / Secret for Incoming Webhook (Callback)
   * 用于验证回调请求的签名
   */
  webhookSecret?: string;

  /**
   * Webhook URL for Group Robot (Send only)
   * 如果配置了这个，将作为群机器人模式运行（通常仅发送）
   */
  webhookUrl?: string;
  
  /**
   * Secret for Group Robot (Send only)
   * 群机器人的加签密钥
   */
  secret?: string;
}

export interface DingTalkConfig extends ChannelConfig<DingTalkAccountConfig> {
  appKey?: string;
  appSecret?: string;
  agentId?: string;
  webhookSecret?: string;
}

export interface ResolvedDingTalkAccount {
  accountId: string;
  name: string;
  enabled: boolean;
  config: DingTalkAccountConfig;
  
  appKey?: string;
  appSecret?: string;
  agentId?: string;
  webhookSecret?: string;
  webhookUrl?: string;
  secret?: string;
  
  tokenSource: "env" | "file" | "config" | "none";
}
