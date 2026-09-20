/**
 * Reads the command line both commands share: which pages to open, in which themes and colour
 * modes, at what sizes, in which browser, on which port, and what to press first.
 *
 * @remarks
 *   A theme, a colour mode, a width or a page can be named more than once with commas, and the
 *   commands run every combination, so one call captures a page in every theme in both modes at
 *   three widths. The parsing is Node's own, because the options are flat and nothing here needs
 *   more than a flag and a value.
 */

import { parseArgs, type ParseArgsConfig } from "node:util";

import { BROWSERS, MODES, type Target } from "./browse.ts";

/**
 * The port the catalogue's own dev server listens on.
 */
const PORT = 4100;

/**
 * The viewport a 4K screen at 125% scaling shows, which is the one the catalogue is read on.
 */
const VIEWPORT = { height: 1080, scale: 1.0, width: 1920 };

/**
 * The options both commands take.
 */
export const SHARED = {
  browser: { default: "firefox", short: "b", type: "string" },
  "forced-colors": { default: false, type: "boolean" },
  height: { default: String(VIEWPORT.height), type: "string" },
  help: { default: false, short: "h", type: "boolean" },
  mode: { default: "", short: "m", type: "string" },
  open: { default: "", type: "string" },
  page: { default: "", short: "p", type: "string" },
  port: { default: String(PORT), type: "string" },
  press: { default: "", type: "string" },
  "reduced-motion": { default: false, type: "boolean" },
  scale: { default: String(VIEWPORT.scale), type: "string" },
  scene: { default: "", short: "s", type: "string" },
  theme: { default: "", short: "t", type: "string" },
  width: { default: String(VIEWPORT.width), short: "w", type: "string" },
} satisfies ParseArgsConfig["options"];

/**
 * The lines of help the shared options add to a command's own.
 */
export const SHARED_HELP = [
  "  -p, --page <path>     the page under /components, such as actions/button; commas for several",
  "  -s, --scene <title>   a scene's title, part of it, or its number on the page",
  "  -t, --theme <name>    a theme, or several with commas; the page's own where left out",
  "  -m, --mode <mode>     light or dark, or both with commas; the page's own where left out",
  "  -w, --width <px>      the viewport's width, 1920 by default; commas for several",
  "      --height <px>     the viewport's height, 1400 by default",
  "      --scale <factor>  the device scale factor, 1.25 by default",
  "      --open <css>      press the first element the selector finds before reading anything",
  "      --press <keys>    type these keys after --open, such as ArrowDown or ArrowDown*12",
  "      --reduced-motion  read the page as someone who asked for less motion",
  "      --forced-colors   read the page in a forced colours mode",
  "  -b, --browser <name>  chromium, firefox or webkit, firefox by default",
  "      --port <port>     the catalogue's port, 4100 by default",
  "  -h, --help            this",
];

/**
 * Describes what the shared options resolve to: one target per combination, and the scene.
 */
export interface Resolved {
  /**
   * The scene named, or undefined for the whole page.
   */
  readonly scene: string | undefined;

  /**
   * One target per page, theme, mode and width named, in that order.
   */
  readonly targets: readonly Target[];
}

/**
 * Describes what was parsed: every option by name, as the string or boolean it was given.
 */
export type Values = Readonly<Record<string, boolean | string | undefined>>;

/**
 * Splits a value that may name several things with commas, dropping the empty ones.
 */
export function listed(value: string): readonly string[] {
  return value
    .split(",")
    .map((one) => one.trim())
    .filter((one) => one !== "");
}

/**
 * Reads an option as a string, empty where it holds none.
 */
export function stringAt(values: Values, name: string): string {
  const value = values[name];

  return typeof value === "string" ? value : "";
}

/**
 * Reads an option as a flag.
 */
export function flagAt(values: Values, name: string): boolean {
  return values[name] === true;
}

/**
 * Reads a number above zero out of an option.
 *
 * @throws {@link Error} When the option holds anything else, naming the option.
 */
function counted(name: string, value: string): number {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`--${name} takes a number above zero`);
  }

  return number;
}

/**
 * Picks one of a list of names.
 *
 * @throws {@link Error} When the value is none of them, naming the option and the names.
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
 * Turns the values parsed into the targets to open.
 *
 * @param values - The options as `parseArgs` read them.
 * @returns The targets and the scene.
 * @throws {@link Error} When no page is named or an option holds a value it cannot take.
 */
export function resolved(values: Values): Resolved {
  const pages = listed(stringAt(values, "page"));

  if (pages.length === 0) throw new Error("--page names the page to open, such as actions/button");

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
 * Reads what every target shares: the browser, the port, the height, the scale, and the
 * conditions the page is read under.
 */
function sharedOf(values: Values): Omit<Target, "mode" | "page" | "theme" | "width"> {
  const open = stringAt(values, "open");
  const press = stringAt(values, "press");

  return {
    browser: named("browser", stringAt(values, "browser"), BROWSERS),
    forcedColors: flagAt(values, "forced-colors"),
    height: counted("height", stringAt(values, "height")),
    open: open === "" ? undefined : open,
    port: counted("port", stringAt(values, "port")),
    press: press === "" ? undefined : press,
    reducedMotion: flagAt(values, "reduced-motion"),
    scale: counted("scale", stringAt(values, "scale")),
  };
}

/**
 * Stands one absent choice in for an empty list, so a loop over the list runs once.
 */
function orNone<Value>(values: readonly Value[]): ReadonlyArray<undefined | Value> {
  return values.length === 0 ? [undefined] : values;
}

/**
 * Writes the slug a target is filed under: the page, the scene, the theme, the mode, the width,
 * and any state or condition it was read under.
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
 * Parses the command line for a command, with its own options beside the shared ones.
 *
 * @param own - The command's own options.
 * @param argv - The arguments, without the runtime and the script.
 * @returns The options by name.
 */
export function parsed(own: ParseArgsConfig["options"], argv: readonly string[]): Values {
  const read = parseArgs({ args: [...argv], options: { ...SHARED, ...own }, strict: true });

  return read.values;
}
