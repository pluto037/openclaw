import { Command } from "commander";
import { createProgramContext } from "./context.js";
import { registerProgramCommands } from "./command-registry.js";
import { configureProgramHelp } from "./help.js";
import { registerPreActionHooks } from "./preaction.js";
import { setLocale, registerTranslations, type Locale } from "../../i18n/index.js";
import { zhCN } from "../../i18n/locales/zh-CN.js";
import { en } from "../../i18n/locales/en.js";

export function buildProgram() {
  const program = new Command();
  const ctx = createProgramContext();
  const argv = process.argv;

  // Initialize i18n
  registerTranslations("en", en);
  registerTranslations("zh-CN", zhCN);

  // Detect language from env or default to en
  const lang =
    process.env.LANG?.includes("zh") || process.env.LC_ALL?.includes("zh") ? "zh-CN" : "en";
  setLocale(lang as Locale);

  configureProgramHelp(program, ctx);
  registerPreActionHooks(program, ctx.programVersion);

  registerProgramCommands(program, ctx, argv);

  return program;
}
