import { t } from "../i18n/index.js";
import type { AuthProfileStore } from "../agents/auth-profiles.js";
import type { AuthChoice } from "./onboard-types.js";

export type AuthChoiceOption = {
  value: AuthChoice;
  label: string;
  hint?: string;
};

export type AuthChoiceGroupId =
  | "openai"
  | "anthropic"
  | "google"
  | "copilot"
  | "openrouter"
  | "ai-gateway"
  | "moonshot"
  | "zai"
  | "xiaomi"
  | "opencode-zen"
  | "minimax"
  | "synthetic"
  | "venice"
  | "qwen"
  | "deepseek";

export type AuthChoiceGroup = {
  value: AuthChoiceGroupId;
  label: string;
  hint?: string;
  options: AuthChoiceOption[];
};

function getAuthChoiceGroupDefs(): {
  value: AuthChoiceGroupId;
  label: string;
  hint?: string;
  choices: AuthChoice[];
}[] {
  return [
    {
      value: "deepseek",
      label: "DeepSeek",
      hint: t("auth.hint.api_key"),
      choices: ["deepseek-api-key"],
    },
    {
      value: "openai",
      label: "OpenAI",
      hint: t("auth.hint.codex_oauth"),
      choices: ["openai-codex", "openai-api-key"],
    },
    {
      value: "anthropic",
      label: "Anthropic",
      hint: t("auth.hint.setup_token"),
      choices: ["token", "apiKey"],
    },
    {
      value: "minimax",
      label: "MiniMax",
      hint: t("auth.hint.m21_rec"),
      choices: ["minimax-api", "minimax-api-lightning"],
    },
    {
      value: "qwen",
      label: "Qwen",
      hint: t("auth.hint.oauth"),
      choices: ["qwen-portal"],
    },
    {
      value: "synthetic",
      label: "Synthetic",
      hint: t("auth.hint.anthropic_compat"),
      choices: ["synthetic-api-key"],
    },
    {
      value: "venice",
      label: "Venice AI",
      hint: t("auth.hint.privacy"),
      choices: ["venice-api-key"],
    },
    {
      value: "google",
      label: "Google",
      hint: t("auth.hint.gemini_oauth"),
      choices: ["gemini-api-key", "google-antigravity", "google-gemini-cli"],
    },
    {
      value: "copilot",
      label: "Copilot",
      hint: t("auth.hint.github_local"),
      choices: ["github-copilot", "copilot-proxy"],
    },
    {
      value: "openrouter",
      label: "OpenRouter",
      hint: t("auth.hint.api_key"),
      choices: ["openrouter-api-key"],
    },
    {
      value: "ai-gateway",
      label: "Vercel AI Gateway",
      hint: t("auth.hint.api_key"),
      choices: ["ai-gateway-api-key"],
    },
    {
      value: "moonshot",
      label: "Moonshot AI",
      hint: t("auth.hint.kimi"),
      choices: ["moonshot-api-key", "kimi-code-api-key"],
    },
    {
      value: "zai",
      label: "Z.AI (GLM 4.7)",
      hint: t("auth.hint.api_key"),
      choices: ["zai-api-key"],
    },
    {
      value: "xiaomi",
      label: "Xiaomi",
      hint: t("auth.hint.api_key"),
      choices: ["xiaomi-api-key"],
    },
    {
      value: "opencode-zen",
      label: "OpenCode Zen",
      hint: t("auth.hint.api_key"),
      choices: ["opencode-zen"],
    },
  ];
}

export function buildAuthChoiceOptions(params: {
  store: AuthProfileStore;
  includeSkip: boolean;
}): AuthChoiceOption[] {
  void params.store;
  const options: AuthChoiceOption[] = [];

  options.push({
    value: "token",
    label: t("auth.label.anthropic_token"),
    hint: t("auth.hint.anthropic_token_cmd"),
  });

  options.push({
    value: "openai-codex",
    label: t("auth.label.openai_codex"),
  });
  options.push({ value: "chutes", label: t("auth.label.chutes") });
  options.push({ value: "openai-api-key", label: t("auth.label.openai_key") });
  options.push({ value: "openrouter-api-key", label: t("auth.label.openrouter_key") });
  options.push({
    value: "ai-gateway-api-key",
    label: t("auth.label.vercel_key"),
  });
  options.push({ value: "moonshot-api-key", label: t("auth.label.moonshot_key") });
  options.push({ value: "kimi-code-api-key", label: t("auth.label.kimi_key") });
  options.push({ value: "synthetic-api-key", label: t("auth.label.synthetic_key") });
  options.push({
    value: "venice-api-key",
    label: t("auth.label.venice_key"),
    hint: t("auth.hint.privacy_inference"),
  });
  options.push({
    value: "github-copilot",
    label: t("auth.label.github_copilot"),
    hint: t("auth.hint.github_device"),
  });
  options.push({ value: "gemini-api-key", label: t("auth.label.gemini_key") });
  options.push({
    value: "google-antigravity",
    label: t("auth.label.google_antigravity"),
    hint: t("auth.hint.antigravity_plugin"),
  });
  options.push({
    value: "google-gemini-cli",
    label: t("auth.label.gemini_cli"),
    hint: t("auth.hint.gemini_plugin"),
  });
  options.push({ value: "zai-api-key", label: t("auth.label.zai_key") });
  options.push({
    value: "xiaomi-api-key",
    label: t("auth.label.xiaomi_key"),
  });
  options.push({ value: "qwen-portal", label: t("auth.label.qwen_oauth") });
  options.push({
    value: "copilot-proxy",
    label: t("auth.label.copilot_proxy"),
    hint: t("auth.hint.copilot_proxy"),
  });
  options.push({ value: "apiKey", label: t("auth.label.anthropic_key") });
  options.push({ value: "deepseek-api-key", label: t("auth.label.deepseek_key") });
  // Token flow is currently Anthropic-only; use CLI for advanced providers.
  options.push({
    value: "opencode-zen",
    label: t("auth.label.opencode_zen"),
    hint: t("auth.hint.opencode_zen"),
  });
  options.push({ value: "minimax-api", label: t("auth.label.minimax_m21") });
  options.push({
    value: "minimax-api-lightning",
    label: t("auth.label.minimax_lightning"),
    hint: t("auth.hint.minimax_lightning"),
  });
  if (params.includeSkip) {
    options.push({ value: "skip", label: t("auth.skip") });
  }

  return options;
}

export function buildAuthChoiceGroups(params: { store: AuthProfileStore; includeSkip: boolean }): {
  groups: AuthChoiceGroup[];
  skipOption?: AuthChoiceOption;
} {
  const options = buildAuthChoiceOptions({
    ...params,
    includeSkip: false,
  });
  const optionByValue = new Map<AuthChoice, AuthChoiceOption>(
    options.map((opt) => [opt.value, opt]),
  );

  const groups = getAuthChoiceGroupDefs().map((group) => ({
    ...group,
    options: group.choices
      .map((choice) => optionByValue.get(choice))
      .filter((opt): opt is AuthChoiceOption => Boolean(opt)),
  }));

  const skipOption = params.includeSkip
    ? ({ value: "skip", label: t("auth.skip") } satisfies AuthChoiceOption)
    : undefined;

  return { groups, skipOption };
}
