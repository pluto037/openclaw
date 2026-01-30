import type {
  ChannelAccountConfig,
  ChannelConfig,
} from "openclaw/plugin-sdk";

export interface QQAccountConfig extends ChannelAccountConfig {
  /**
   * QQ Bot App ID
   */
  appId?: string;
  
  /**
   * QQ Bot Token
   */
  token?: string;
  
  /**
   * QQ Bot Client Secret (Optional)
   */
  clientSecret?: string;

  /**
   * Sandbox mode
   */
  sandbox?: boolean;
}

export interface QQConfig extends ChannelConfig<QQAccountConfig> {
  appId?: string;
  token?: string;
  clientSecret?: string;
  sandbox?: boolean;
}

export interface ResolvedQQAccount {
  accountId: string;
  name: string;
  enabled: boolean;
  config: QQAccountConfig;
  
  appId?: string;
  token?: string;
  clientSecret?: string;
  sandbox: boolean;
  
  tokenSource: "env" | "file" | "config" | "none";
}
