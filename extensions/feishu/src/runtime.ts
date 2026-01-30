import type { PluginRuntime } from "openclaw/plugin-sdk";
import type { FeishuClient } from "./api.js";

interface FeishuRuntime {
  channel: {
    feishu: {
       // Helper to store clients by accountId
       clients: Map<string, FeishuClient>;
    };
  };
}

let runtime: PluginRuntime & FeishuRuntime;

export function setFeishuRuntime(rt: PluginRuntime & FeishuRuntime) {
  runtime = rt;
}

export function getFeishuRuntime() {
  if (!runtime) throw new Error("Feishu runtime not initialized");
  return runtime;
}
