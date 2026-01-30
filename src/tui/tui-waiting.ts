import { t } from "../i18n/index.js";

type MinimalTheme = {
  dim: (s: string) => string;
  bold: (s: string) => string;
  accentSoft: (s: string) => string;
};

export const defaultWaitingKeys = [
  "tui.waiting.flibbertigibbeting",
  "tui.waiting.kerfuffling",
  "tui.waiting.dillydallying",
  "tui.waiting.twiddling_thumbs",
  "tui.waiting.noodling",
  "tui.waiting.bamboozling",
  "tui.waiting.moseying",
  "tui.waiting.hobnobbing",
  "tui.waiting.pondering",
  "tui.waiting.conjuring",
];

export function pickWaitingPhrase(tick: number, keys = defaultWaitingKeys) {
  const idx = Math.floor(tick / 10) % keys.length;
  const key = keys[idx] ?? keys[0] ?? "tui.waiting.default";
  return t(key);
}

export function shimmerText(theme: MinimalTheme, text: string, tick: number) {
  const width = 6;
  const hi = (ch: string) => theme.bold(theme.accentSoft(ch));

  const pos = tick % (text.length + width);
  const start = Math.max(0, pos - width);
  const end = Math.min(text.length - 1, pos);

  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    out += i >= start && i <= end ? hi(ch) : theme.dim(ch);
  }
  return out;
}

export function buildWaitingStatusMessage(params: {
  theme: MinimalTheme;
  tick: number;
  elapsed: string;
  connectionStatus: string;
  phrases?: string[];
}) {
  const phrase = pickWaitingPhrase(params.tick, params.phrases);
  const cute = shimmerText(params.theme, `${phrase}…`, params.tick);
  return `${cute} • ${params.elapsed} | ${params.connectionStatus}`;
}
