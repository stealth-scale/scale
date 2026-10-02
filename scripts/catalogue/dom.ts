/**
 * Reads the DOM of a catalogue page or one scene of it: an outline by default, and on request the
 * element tree, computed styles, matched rules, the accessibility tree, an axe audit, boxes,
 * measurements and theme tokens.
 *
 * @remarks
 *   Run against a catalogue that is already serving. The outline lists headings, landmarks,
 *   controls with their accessible names, the element count per recipe, untranslated keys and
 *   console errors. Every other reading targets the elements a selector matches, and `--json`
 *   prints any reading as JSON for a diff between builds, themes or ports.
 *   Usage: `node scripts/catalogue/dom.ts --page components/actions/button`, plus the options
 *   `--help` lists.
 */

import {
  eachOpened,
  type Opened,
  rooted,
  scenesOn,
  staged,
  STATES,
  type Target,
} from "./browse.ts";
import {
  flagAt,
  listed,
  named,
  parsed,
  resolved,
  SHARED_HELP,
  slugOf,
  stringAt,
  type Values,
} from "./options.ts";
import { audited } from "./read/audit.ts";
import { boxed } from "./read/boxes.ts";
import { type Measure, measured, MEASURES } from "./read/measure.ts";
import { outlined } from "./read/outline.ts";
import { printed, type Reading } from "./read/print.ts";
import { ruled, styled } from "./read/styles.ts";
import { tokened } from "./read/tokens.ts";
import { treed } from "./read/tree.ts";

/**
 * Options this command adds to the shared ones.
 */
const OWN = {
  aria: { default: false, type: "boolean" },
  axe: { default: false, type: "boolean" },
  box: { default: "", type: "string" },
  classes: { default: "recipe", type: "string" },
  css: { default: "", type: "string" },
  "css-all": { default: false, type: "boolean" },
  depth: { default: "8", short: "d", type: "string" },
  json: { default: false, short: "j", type: "boolean" },
  measure: { default: "", type: "string" },
  outline: { default: false, type: "boolean" },
  rules: { default: "", type: "string" },
  select: { default: "", type: "string" },
  state: { default: "rest", type: "string" },
  tokens: { default: false, type: "boolean" },
  tree: { default: false, type: "boolean" },
} as const;

/**
 * Help text the command prints for `--help`.
 */
const HELP = [
  "Reads the DOM of a catalogue page or one scene of it.",
  "",
  "Usage: node scripts/catalogue/dom.ts --page <path> [options]",
  "",
  ...SHARED_HELP,
  "      --select <css>    read the elements a selector matches instead of the page or the scene",
  "      --outline         print the whole outline beside another reading",
  "      --tree            print the element tree",
  "  -d, --depth <n>       tree depth, 8 by default",
  "      --classes <which> recipe or all: the classes the tree prints",
  "      --css <css>       computed style of each element the selector matches in the region",
  "      --css-all         every computed property instead of the layout and paint subset",
  "      --rules <css>     rules matching the first element the selector matches; chromium only",
  `      --state <state>   state of the element --css or --rules reads: ${STATES.join(", ")}`,
  "      --aria            accessibility tree of the region",
  "      --axe             axe audit of the region",
  "      --box <css>       box of each element the selector matches in the region",
  `      --measure <kinds> ${MEASURES.join(", ")}, commas for several; measures the --select elements`,
  "      --tokens          custom properties on the root, for the theme and the mode",
  "  -j, --json            print JSON instead of text",
  "",
  "The region is the page, the scene named with --scene, or the elements named with --select.",
  "",
  "Examples:",
  "  node scripts/catalogue/dom.ts -p components/actions/button",
  "  node scripts/catalogue/dom.ts -p components/layout/grid -s spans --tree --depth 4",
  '  node scripts/catalogue/dom.ts -p components/actions/button --css "[data-recipe=button]" --state hover -b chromium',
  '  node scripts/catalogue/dom.ts -p components/actions/button --rules "[data-recipe=button]" -b chromium',
  '  node scripts/catalogue/dom.ts -p components/data/badge -s marks --select ".badge" --measure ink,glyph',
  "  node scripts/catalogue/dom.ts -p components/actions/button --tokens -t asphalt -m dark --json",
];

/**
 * Readings requested on the command line, beyond the targets.
 */
interface Asked {
  /**
   * Prints the accessibility tree.
   */
  readonly aria: boolean;

  /**
   * Runs axe.
   */
  readonly axe: boolean;

  /**
   * Selector whose boxes are printed, or an empty string.
   */
  readonly box: string;

  /**
   * Selector whose computed styles are printed, or an empty string.
   */
  readonly css: string;

  /**
   * Prints every computed property.
   */
  readonly cssAll: boolean;

  /**
   * Tree depth.
   */
  readonly depth: number;

  /**
   * Keeps every class in the tree.
   */
  readonly every: boolean;

  /**
   * Prints JSON.
   */
  readonly json: boolean;

  /**
   * Measurements taken of the `select` elements.
   */
  readonly measures: readonly Measure[];

  /**
   * Prints the whole outline beside another reading.
   */
  readonly outline: boolean;

  /**
   * Selector whose matched rules are printed, or an empty string.
   */
  readonly rules: string;

  /**
   * Selector that replaces the page or the scene as the region, or an empty string.
   */
  readonly select: string;

  /**
   * State the `css` or `rules` element is put in.
   */
  readonly state: (typeof STATES)[number];

  /**
   * Prints the theme tokens.
   */
  readonly tokens: boolean;

  /**
   * Prints the element tree.
   */
  readonly tree: boolean;
}

/**
 * Parses the requested readings from the command-line values.
 *
 * @throws {@link Error} When the depth is not a whole number above zero, or `--measure` is given
 *   without `--select`.
 */
function askedOf(values: Values): Asked {
  const depth = Number(stringAt(values, "depth"));
  const select = stringAt(values, "select");
  const measures = listed(stringAt(values, "measure")).map((one) =>
    named("measure", one, MEASURES),
  );

  if (!Number.isInteger(depth) || depth < 1) {
    throw new Error("--depth takes a whole number above zero");
  }

  if (measures.length > 0 && select === "") {
    throw new Error("--measure needs --select, the elements to measure");
  }

  return {
    aria: flagAt(values, "aria"),
    axe: flagAt(values, "axe"),
    box: stringAt(values, "box"),
    css: stringAt(values, "css"),
    cssAll: flagAt(values, "css-all"),
    depth,
    every: named("classes", stringAt(values, "classes") || "recipe", ["recipe", "all"]) === "all",
    json: flagAt(values, "json"),
    measures,
    outline: flagAt(values, "outline"),
    rules: stringAt(values, "rules"),
    select,
    state: named("state", stringAt(values, "state") || "rest", STATES),
    tokens: flagAt(values, "tokens"),
    tree: flagAt(values, "tree"),
  };
}

/**
 * One page to read: the open page, how it was opened, and the readings requested.
 */
interface Job {
  /**
   * Readings requested.
   */
  readonly asked: Asked;

  /**
   * Console errors the page logged while loading.
   */
  readonly errors: readonly string[];

  /**
   * Open page.
   */
  readonly page: Opened["page"];

  /**
   * Scene named, or undefined for the whole page.
   */
  readonly scene: string | undefined;

  /**
   * Target the page was opened with.
   */
  readonly target: Target;
}

/**
 * Takes every reading requested beyond the outline.
 */
async function extras(
  job: Job,
  root: Awaited<ReturnType<typeof rooted>>,
): Promise<Omit<Reading, "outline" | "target">> {
  const { asked, page } = job;

  return {
    ...(asked.aria ? { aria: await root.first().ariaSnapshot() } : {}),
    ...(asked.axe ? { axe: await audited(page, root) } : {}),
    ...(asked.box === "" ? {} : { boxes: await boxed(root, asked.box) }),
    ...(asked.css === "" ? {} : { css: await styled(root, asked.css, asked.cssAll) }),
    ...(asked.measures.length === 0 ? {} : { measures: await measured(root, asked.measures) }),
    ...(asked.rules === "" ? {} : { rules: await ruled(page, root, asked.rules) }),
    ...(asked.tokens ? { tokens: await tokened(page) } : {}),
    ...(asked.tree ? { tree: await treed(root, asked.depth, asked.every) } : {}),
  };
}

/**
 * Reads one open page, with the `css` or `rules` element put in the requested state first and
 * returned to rest after.
 *
 * @param job - Page and readings.
 * @returns The reading.
 */
async function read(job: Job): Promise<Reading> {
  const { asked, errors, page, scene, target } = job;
  const root = await rooted(page, scene, asked.select);
  const subject = asked.css || asked.rules;
  const undone =
    subject === ""
      ? (): Promise<void> => Promise.resolve()
      : await staged(page, root.locator(subject).first(), asked.state);
  const reading: Reading = {
    ...(await extras(job, root)),
    outline: { ...(await outlined(root)), errors, scenes: await scenesOn(page) },
    target: slugOf(target, scene, asked.state === "rest" ? undefined : asked.state),
  };

  await undone();

  return reading;
}

/**
 * Reads every target named on the command line.
 */
async function main(): Promise<void> {
  const values = parsed(OWN, process.argv.slice(2));

  if (flagAt(values, "help")) {
    console.log(HELP.join("\n"));

    return;
  }

  const { scene, targets } = resolved(values);
  const asked = askedOf(values);

  await eachOpened(targets, async ({ errors, page }, target) => {
    const reading = await read({ asked, errors, page, scene, target });

    console.log(asked.json ? JSON.stringify(reading, null, 2) : printed(reading, asked.outline));
  });
}

try {
  await main();
} catch (error) {
  console.error(
    `error: ${error instanceof Error ? (error.message.split("\n")[0] ?? "") : String(error)}`,
  );
  process.exitCode = 1;
}
