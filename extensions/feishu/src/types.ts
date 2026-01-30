import type {
  ChannelAccountConfig,
  ChannelConfig,
} from "openclaw/plugin-sdk";

export interface FeishuAccountConfig extends ChannelAccountConfig {
  /**
   * App ID (cli_...)
   */
  appId?: string;
  
  /**
   * App Secret
   */
  appSecret?: string;
  
  /**
   * Verification Token
   */
  verificationToken?: string;
  
  /**
   * Encrypt Key
   */
  encryptKey?: string;
}

export interface FeishuConfig extends ChannelConfig<FeishuAccountConfig> {
  appId?: string;
  appSecret?: string;
  verificationToken?: string;
  encryptKey?: string;
}

export interface ResolvedFeishuAccount {
  accountId: string;
  name: string;
  enabled: boolean;
  config: FeishuAccountConfig;
  
  appId?: string;
  appSecret?: string;
  verificationToken?: string;
  encryptKey?: string;
  
  tokenSource: "env" | "file" | "config" | "none";
}
