import type { PluginRuntime } from "openclaw/plugin-sdk";
import type { DingTalkChannel } from "./api.js";

interface DingTalkRuntime {
  channel: {
    dingtalk: DingTalkChannel;
  };
}

let runtime: PluginRuntime & DingTalkRuntime;

export function setDingTalkRuntime(rt: PluginRuntime & DingTalkRuntime) {
  runtime = rt;
}

export function getDingTalkRuntime() {
  if (!runtime) throw new Error("DingTalk runtime not initialized");
  return runtime;
}
