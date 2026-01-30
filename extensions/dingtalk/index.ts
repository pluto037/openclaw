import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { dingTalkPlugin } from "./src/channel.js";
import { DingTalkChannel } from "./src/api.js";
import { setDingTalkRuntime } from "./src/runtime.js";

const plugin = {
  id: "dingtalk",
  name: "DingTalk",
  description: "DingTalk channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    const channel = new DingTalkChannel(api.runtime);
    setDingTalkRuntime({ ...api.runtime, channel: { dingtalk: channel } });
    api.registerChannel({ plugin: dingTalkPlugin });
  },
};

export default plugin;
