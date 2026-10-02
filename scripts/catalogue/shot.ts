/**
 * Captures a catalogue page, one scene, or one element as PNG files, per theme, colour mode,
 * width, browser and control state.
 *
 * @remarks
 *   Run against a catalogue that is already serving. Each combination of page, theme, mode and
 *   width writes one file under `.scratch/shots` unless `--out` names another directory. A scene or
 *   an element is clipped to its box plus `--margin`. A page is captured to the fold unless
 *   `--full` is set. Each `--state` writes one more file, with the control hovered, focused by Tab
 *   or pressed. Animations are frozen, so two captures of one element overlay pixel for pixel.
 *   Usage: `node scripts/catalogue/shot.ts --page components/actions/button`, plus the options
 *   `--help` lists.
 */

import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { type Locator, type Page } from "playwright";

import { eachOpened, rooted, staged, STATES, type Target, unclamped } from "./browse.ts";
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

/**
 * Default output directory.
 */
const OUT = ".scratch/shots";

/**
 * Options this command adds to the shared ones.
 */
const OWN = {
  element: { default: "", short: "e", type: "string" },
  full: { default: false, short: "f", type: "boolean" },
  margin: { default: "8", type: "string" },
  out: { default: OUT, short: "o", type: "string" },
  state: { default: "", type: "string" },
} as const;

/**
 * Help text the command prints for `--help`.
 */
const HELP = [
  "Captures a catalogue page, one scene, or one element as PNG files.",
  "",
  "Usage: node scripts/catalogue/shot.ts --page <id> [options]",
  "",
  ...SHARED_HELP,
  "  -e, --element <css>   capture the first visible match of the selector",
  `      --state <states>  ${STATES.join(", ")}, commas for several; needs --element`,
  "  -f, --full            capture the whole page instead of the fold",
  "      --margin <px>     space around a scene or an element for a ring or a shadow, 8 by default",
  `  -o, --out <dir>       output directory, ${OUT} by default`,
  "",
  "Examples:",
  "  node scripts/catalogue/shot.ts -p components/actions/button -t asphalt,prism -m light,dark",
  "  node scripts/catalogue/shot.ts -p components/layout/stack -s gaps -w 420,1024,3072",
  '  node scripts/catalogue/shot.ts -p components/actions/button -e "[data-recipe=button]" --state rest,hover,focus,active',
  '  node scripts/catalogue/shot.ts -p components/disclosure/menu --open "[data-recipe=menu] button" -e "[role=menu]"',
];

/**
 * Captures requested on the command line, beyond the targets.
 */
interface Asked {
  /**
   * Selector of the element to capture, or an empty string for the page or the scene.
   */
  readonly element: string;

  /**
   * Captures the whole page instead of the fold.
   */
  readonly full: boolean;

  /**
   * Space around a scene or an element, in CSS pixels, for a ring or a shadow outside its box.
   */
  readonly margin: number;

  /**
   * Output directory.
   */
  readonly out: string;

  /**
   * Scene named, or undefined.
   */
  readonly scene: string | undefined;

  /**
   * Control states to capture. An empty array captures the element once at rest.
   */
  readonly states: ReadonlyArray<(typeof STATES)[number]>;
}

/**
 * Parses the requested captures from the command-line values.
 *
 * @throws {@link Error} When `--state` is given without `--element`.
 */
function askedOf(values: Values, scene: string | undefined): Asked {
  const element = stringAt(values, "element");
  const states = listed(stringAt(values, "state")).map((state) => named("state", state, STATES));

  if (states.length > 0 && element === "") {
    throw new Error("--state needs --element, the control to put in the state");
  }

  return {
    element,
    full: flagAt(values, "full"),
    margin: Math.max(0, Number(stringAt(values, "margin")) || 0),
    out: stringAt(values, "out") || OUT,
    scene,
    states,
  };
}

/**
 * Captures one locator to a file with animations frozen and `margin` pixels around its box.
 *
 * @throws {@link Error} When the element has no box.
 */
async function captured(subject: Locator, path: string, margin: number): Promise<void> {
  await subject.scrollIntoViewIfNeeded();

  const box = await subject.boundingBox();

  if (box === null) throw new Error("the element has no box to capture");

  const page = subject.page();
  const clip = {
    height: box.height + 2 * margin,
    width: box.width + 2 * margin,
    x: Math.max(0, box.x - margin),
    y: Math.max(0, box.y - margin),
  };

  await page.screenshot({ animations: "disabled", clip, path });
}

/**
 * Captures one open page as requested and returns the paths written.
 */
async function shot(page: Page, target: Target, asked: Asked): Promise<readonly string[]> {
  const found = await rooted(page, asked.scene, asked.element);
  const visible = asked.element === "" ? found : found.filter({ visible: true });

  if ((await visible.count()) === 0) throw new Error(`nothing visible matches ${asked.element}`);

  const subject = visible.first();
  const part = asked.element === "" ? asked.scene : "element";
  const paths: string[] = [];

  if (asked.states.length === 0) {
    const path = join(asked.out, `${slugOf(target, part)}.png`);

    if (asked.element === "" && asked.scene === undefined) {
      if (asked.full) await unclamped(page);
      await page.screenshot({ animations: "disabled", fullPage: asked.full, path });
    } else {
      await captured(subject, path, asked.margin);
    }

    paths.push(path);
  }

  for (const state of asked.states) {
    const path = join(asked.out, `${slugOf(target, part, state)}.png`);
    const undone = await staged(page, subject, state);

    await captured(subject, path, asked.margin);
    await undone();
    paths.push(path);
  }

  return paths;
}

/**
 * Captures every target named on the command line and prints each path written.
 */
async function main(): Promise<void> {
  const values = parsed(OWN, process.argv.slice(2));

  if (flagAt(values, "help")) {
    console.log(HELP.join("\n"));

    return;
  }

  const { scene, targets } = resolved(values);
  const asked = askedOf(values, scene);

  await mkdir(asked.out, { recursive: true });

  await eachOpened(targets, async ({ errors, page }, target) => {
    for (const path of await shot(page, target, asked)) console.log(path);

    if (errors.length > 0) {
      console.log(`  ${String(errors.length)} console errors:`);

      for (const error of errors) console.log(`    ${error}`);
    }
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
