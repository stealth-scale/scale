/**
 * Parses the command-line options every catalogue command shares: pages, themes, colour modes,
 * viewport, browser, base URL, and the controls to press before reading.
 *
 * @remarks
 *   Pages, themes, modes and widths each accept a comma-separated list, and the commands run every
 *   combination. Parsing uses Node's `parseArgs`, because every option is a flat flag or value.
 */

import { parseArgs, type ParseArgsConfig } from "node:util";

import { BROWSERS, MODES, type Target } from "./browse.ts";

/**
 * Base URL of the catalogue's dev server.
 */
const BASE = "http://localhost:4100";

/**
 * Default viewport: 1920 by 1080 CSS pixels at device scale 1.
 */
const VIEWPORT = { height: 1080, scale: 1.0, width: 1920 };

/**
 * Options every command accepts.
 */
export const SHARED = {
  base: { default: BASE, type: "string" },
  browser: { default: "firefox", short: "b", type: "string" },
  "forced-colors": { default: false, type: "boolean" },
  height: { default: String(VIEWPORT.height), type: "string" },
  help: { default: false, short: "h", type: "boolean" },
  mode: { default: "", short: "m", type: "string" },
  open: { default: "", type: "string" },
  page: { default: "", short: "p", type: "string" },
  press: { default: "", type: "string" },
  "reduced-motion": { default: false, type: "boolean" },
  scale: { default: String(VIEWPORT.scale), type: "string" },
  scene: { default: "", short: "s", type: "string" },
  theme: { default: "", short: "t", type: "string" },
  width: { default: String(VIEWPORT.width), short: "w", type: "string" },
} satisfies ParseArgsConfig["options"];

/**
 * Help lines for the shared options, which each command prints above its own.
 */
export const SHARED_HELP = [
  "  -p, --page <id>       page id, such as components/actions/button; commas for several",
  "  -s, --scene <title>   scene title, part of it, or its position on the page",
  "  -t, --theme <name>    theme, commas for several; the page's stored theme when omitted",
  "  -m, --mode <mode>     light or dark, commas for both; the page's stored mode when omitted",
  `  -w, --width <px>      viewport width, ${String(VIEWPORT.width)} by default; commas for several`,
  `      --height <px>     viewport height, ${String(VIEWPORT.height)} by default`,
  `      --scale <factor>  device scale factor, ${String(VIEWPORT.scale)} by default`,
  "      --open <css>      click the first match of each selector, semicolons between them",
  "      --press <keys>    keys typed after --open, such as ArrowDown or ArrowDown*12",
  "      --reduced-motion  emulate prefers-reduced-motion: reduce",
  "      --forced-colors   emulate forced-colors: active",
  "  -b, --browser <name>  chromium, firefox or webkit, firefox by default",
  `      --base <url>      catalogue base URL, ${BASE} by default`,
  "  -h, --help            print this help",
];

/**
 * Shared options resolved into targets.
 */
export interface Resolved {
  /**
   * Scene named, or undefined for the whole page.
   */
  readonly scene: string | undefined;

  /**
   * One target per page, theme, mode and width, in that nesting order.
   */
  readonly targets: readonly Target[];
}

/**
 * Parsed options by name, each a string or a boolean.
 */
export type Values = Readonly<Record<string, boolean | string | undefined>>;

/**
 * Splits a comma-separated value and drops empty entries.
 */
export function listed(value: string): readonly string[] {
  return value
    .split(",")
    .map((one) => one.trim())
    .filter((one) => one !== "");
}

/**
 * Returns an option's string value, or an empty string when it is not a string.
 */
export function stringAt(values: Values, name: string): string {
  const value = values[name];

  return typeof value === "string" ? value : "";
}

/**
 * Returns true when a boolean option is set.
 */
export function flagAt(values: Values, name: string): boolean {
  return values[name] === true;
}

/**
 * Parses an option value as a number above zero.
 *
 * @throws {@link Error} When the value is not a finite number above zero.
 */
function counted(name: string, value: string): number {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`--${name} takes a number above zero`);
  }

  return number;
}

/**
 * Parses the base URL.
 *
 * @throws {@link Error} When the value is not an absolute URL.
 */
function based(value: string): string {
  try {
    return new URL(value).href;
  } catch {
    throw new Error(`--base takes an absolute URL, such as ${BASE}`);
  }
}

/**
 * Returns the value when it is one of the allowed names.
 *
 * @throws {@link Error} When the value is not in `names`.
 */
export function named<Name extends string>(
  option: string,
  value: string,
  names: readonly Name[],
): Name {
  const found = names.find((one) => one === value);

  if (found === undefined) throw new Error(`--${option} takes one of ${names.join(", ")}`);

  return found;
}

/**
 * Resolves the parsed options into one target per combination.
 *
 * @param values - Options as `parseArgs` returns them.
 * @returns The targets and the scene.
 * @throws {@link Error} When no page is given or an option has an invalid value.
 */
export function resolved(values: Values): Resolved {
  const pages = listed(stringAt(values, "page"));

  if (pages.length === 0) {
    throw new Error("--page takes a page id, such as components/actions/button");
  }

  const themes = orNone(listed(stringAt(values, "theme")));
  const modes = orNone(listed(stringAt(values, "mode")).map((mode) => named("mode", mode, MODES)));
  const widths = listed(stringAt(values, "width")).map((width) => counted("width", width));
  const shared = sharedOf(values);
  const targets: Target[] = [];

  for (const page of pages) {
    for (const theme of themes) {
      for (const mode of modes) {
        for (const width of widths.length === 0 ? [VIEWPORT.width] : widths) {
          targets.push({ ...shared, mode, page, theme, width });
        }
      }
    }
  }

  const scene = stringAt(values, "scene");

  return { scene: scene === "" ? undefined : scene, targets };
}

/**
 * Parses the target fields that do not vary per combination: base URL, browser, viewport height,
 * scale, emulated media and the controls to press.
 */
function sharedOf(values: Values): Omit<Target, "mode" | "page" | "theme" | "width"> {
  const open = stringAt(values, "open");
  const press = stringAt(values, "press");

  return {
    base: based(stringAt(values, "base")),
    browser: named("browser", stringAt(values, "browser"), BROWSERS),
    forcedColors: flagAt(values, "forced-colors"),
    height: counted("height", stringAt(values, "height")),
    open: open === "" ? undefined : open,
    press: press === "" ? undefined : press,
    reducedMotion: flagAt(values, "reduced-motion"),
    scale: counted("scale", stringAt(values, "scale")),
  };
}

/**
 * Returns `[undefined]` for an empty list, so a loop over the list runs once with no value.
 */
function orNone<Value>(values: readonly Value[]): ReadonlyArray<undefined | Value> {
  return values.length === 0 ? [undefined] : values;
}

/**
 * Builds the file slug for a target: page, extra parts, theme, mode, width and emulated media.
 */
export function slugOf(target: Target, ...more: ReadonlyArray<string | undefined>): string {
  const parts = [
    target.page.replaceAll("/", "-"),
    ...more.map((part) => part?.toLowerCase().replaceAll(/[^a-z0-9]+/gu, "-")),
    target.theme,
    target.mode,
    `${String(target.width)}w`,
    target.reducedMotion ? "reduced-motion" : undefined,
    target.forcedColors ? "forced-colors" : undefined,
  ];

  return parts.filter((part) => part !== undefined && part !== "").join("--");
}

/**
 * Parses the command line with a command's own options added to the shared ones.
 *
 * @param own - The command's own options.
 * @param argv - Arguments after the runtime and the script path.
 * @returns Options by name.
 */
export function parsed(own: ParseArgsConfig["options"], argv: readonly string[]): Values {
  const read = parseArgs({ args: [...argv], options: { ...SHARED, ...own }, strict: true });

  return read.values;
}
