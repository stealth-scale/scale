/**
 * Reads the document a page of the catalogue, or one scene of it, draws: an outline of what is
 * on it, and, where asked, the tree of elements, the styles an element is drawn with, the rules
 * that reach it, the accessibility tree, an accessibility audit, the boxes, and the tokens the
 * theme has in force.
 *
 * @remarks
 *   Run against a catalogue that is already serving. The outline says what a reader or a screen
 *   reader meets: the headings, the landmarks, the controls with their accessible names, how many
 *   elements each recipe drew, any word left as the key it was looked up by, and what the console
 *   reported. Everything else is a reading of one thing at a time, named by a selector, and every
 *   reading comes out as text or, with `--json`, as JSON for a diff between two builds, two
 *   themes or two ports.
 *   Usage: node scripts/catalogue/dom.ts --page actions/button [--scene looks] [--tree]
 *   [--classes all] [--css "[data-recipe=button]"] [--rules "[data-recipe=button]"] [--aria]
 *   [--axe] [--box "[data-recipe=button]"] [--tokens] [--json]
 */

import { type Locator, type Page } from "playwright";

import { eachOpened, rooted, scenesOn, staged, STATES, type Target } from "./browse.ts";
import {
  flagAt,
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
import { outlined } from "./read/outline.ts";
import { printed, type Reading } from "./read/print.ts";
import { ruled, styled } from "./read/styles.ts";
import { tokened } from "./read/tokens.ts";
import { treed } from "./read/tree.ts";

/**
 * The command's own options.
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
  outline: { default: false, type: "boolean" },
  rules: { default: "", type: "string" },
  select: { default: "", type: "string" },
  state: { default: "rest", type: "string" },
  tokens: { default: false, type: "boolean" },
  tree: { default: false, type: "boolean" },
} as const;

/**
 * The help this command prints.
 */
const HELP = [
  "Reads the document a page of the catalogue, or one scene of it, draws.",
  "",
  "Usage: node scripts/catalogue/dom.ts --page <path> [options]",
  "",
  ...SHARED_HELP,
  "      --select <css>    read the elements a selector finds rather than the page or the scene",
  "      --outline         print the whole outline beside another reading; alone, it is printed anyway",
  "      --tree            print the tree of elements",
  "  -d, --depth <n>       how deep the tree goes, 8 by default",
  "      --classes <which> recipe classes alone in the tree, or all of them: recipe or all",
  "      --css <css>       the computed style of each element the selector finds in the region",
  "      --css-all         every computed property rather than the visual ones",
  "      --rules <css>     the rules that reach the first element the selector finds; chromium only",
  `      --state <state>   put the element read by --css or --rules in a state: ${STATES.join(", ")}`,
  "      --aria            the accessibility tree of the region",
  "      --axe             an accessibility audit of the region",
  "      --box <css>       the box of each element the selector finds in the region",
  "      --tokens          the custom properties in force on the root, for the theme and the mode",
  "  -j, --json            print JSON rather than text",
  "",
  "The region is the page, the scene named with --scene, or the elements named with --select.",
  "",
  "Examples:",
  "  node scripts/catalogue/dom.ts -p actions/button",
  "  node scripts/catalogue/dom.ts -p layout/grid -s spans --tree --depth 4",
  '  node scripts/catalogue/dom.ts -p actions/button --css "[data-recipe=button]" --state hover -b chromium',
  '  node scripts/catalogue/dom.ts -p actions/button --rules "[data-recipe=button]" -b chromium',
  "  node scripts/catalogue/dom.ts -p actions/button --tokens -t asphalt -m dark --json > asphalt.json",
];

/**
 * Describes what the command was asked to read, beyond the targets.
 */
interface Asked {
  /**
   * Whether the accessibility tree is read.
   */
  readonly aria: boolean;

  /**
   * Whether the audit runs.
   */
  readonly axe: boolean;

  /**
   * Which elements' boxes are read, or nothing.
   */
  readonly box: string;

  /**
   * Which elements' computed styles are read, or nothing.
   */
  readonly css: string;

  /**
   * Whether every computed property is read.
   */
  readonly cssAll: boolean;

  /**
   * How deep the tree goes.
   */
  readonly depth: number;

  /**
   * Whether every class is kept in the tree.
   */
  readonly every: boolean;

  /**
   * Whether the reading is printed as JSON.
   */
  readonly json: boolean;

  /**
   * Whether the whole outline is printed beside another reading.
   */
  readonly outline: boolean;

  /**
   * Which element's rules are read, or nothing.
   */
  readonly rules: string;

  /**
   * Which elements are read rather than the page or the scene, or nothing.
   */
  readonly select: string;

  /**
   * The state the element read by `css` or `rules` is put in.
   */
  readonly state: (typeof STATES)[number];

  /**
   * Whether the tokens are read.
   */
  readonly tokens: boolean;

  /**
   * Whether the tree is read.
   */
  readonly tree: boolean;
}

/**
 * Reads what was asked off the values parsed.
 *
 * @throws {@link Error} When the depth is not a whole number above zero.
 */
function askedOf(values: Values): Asked {
  const depth = Number(stringAt(values, "depth"));

  if (!Number.isInteger(depth) || depth < 1) {
    throw new Error("--depth takes a whole number above zero");
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
    outline: flagAt(values, "outline"),
    rules: stringAt(values, "rules"),
    select: stringAt(values, "select"),
    state: named("state", stringAt(values, "state") || "rest", STATES),
    tokens: flagAt(values, "tokens"),
    tree: flagAt(values, "tree"),
  };
}

/**
 * Describes one page to read: the page, how it was opened, and what to read on it.
 */
interface Job {
  /**
   * The readings asked for.
   */
  readonly asked: Asked;

  /**
   * The errors the console reported while the page loaded.
   */
  readonly errors: readonly string[];

  /**
   * The open page.
   */
  readonly page: Page;

  /**
   * The scene named, or undefined for the whole page.
   */
  readonly scene: string | undefined;

  /**
   * How the page was opened.
   */
  readonly target: Target;
}

/**
 * Reads the parts of a page that a selector or a flag asked for, beyond the outline.
 */
async function extras(job: Job, root: Locator): Promise<Omit<Reading, "outline" | "target">> {
  const { asked, page } = job;

  return {
    ...(asked.aria ? { aria: await root.first().ariaSnapshot() } : {}),
    ...(asked.axe ? { axe: await audited(page, root) } : {}),
    ...(asked.box === "" ? {} : { boxes: await boxed(root, asked.box) }),
    ...(asked.css === "" ? {} : { css: await styled(root, asked.css, asked.cssAll) }),
    ...(asked.rules === "" ? {} : { rules: await ruled(page, root, asked.rules) }),
    ...(asked.tokens ? { tokens: await tokened(page) } : {}),
    ...(asked.tree ? { tree: await treed(root, asked.depth, asked.every) } : {}),
  };
}

/**
 * Reads one open page, with the element the styles are read from put in its state first.
 *
 * @param job - The page and the readings asked for.
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
