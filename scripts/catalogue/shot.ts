/**
 * Captures a page of the catalogue, one scene of it, or one element on it, as an image: in a
 * theme, in a colour mode, at a viewport, in a browser, and in the states a control takes.
 *
 * @remarks
 *   Run against a catalogue that is already serving. Each combination of page, theme, mode and
 *   width is one image, named for all of them, under `.scratch/shots` unless another directory is
 *   named. A scene is captured on its own by clipping to its section, an element by clipping to
 *   the first the selector finds. A whole page is captured to the fold unless `--full` asks for
 *   everything. A control is captured in each state named, hovered, focused from the keyboard or
 *   held down, one image per state. Animations are held still while capturing, so two captures
 *   of one thing can be laid over each other.
 *   Usage: node scripts/catalogue/shot.ts --page actions/button [--scene looks]
 *   [--element "[data-recipe=button]"] [--state rest,hover,focus,active] [--theme prism]
 *   [--mode dark] [--full] [--out .scratch/shots]
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
 * Where the images go unless a directory is named.
 */
const OUT = ".scratch/shots";

/**
 * The command's own options.
 */
const OWN = {
  element: { default: "", short: "e", type: "string" },
  full: { default: false, short: "f", type: "boolean" },
  margin: { default: "8", type: "string" },
  out: { default: OUT, short: "o", type: "string" },
  state: { default: "", type: "string" },
} as const;

/**
 * The help this command prints.
 */
const HELP = [
  "Captures a page of the catalogue, one scene of it, or one element on it, as an image.",
  "",
  "Usage: node scripts/catalogue/shot.ts --page <path> [options]",
  "",
  ...SHARED_HELP,
  "  -e, --element <css>   capture the first element the selector finds",
  `      --state <states>  ${STATES.join(", ")}, or several with commas; needs --element`,
  "  -f, --full            capture the whole page rather than to the fold",
  "      --margin <px>     room round a scene or an element for a ring or a shadow, 8 by default",
  `  -o, --out <dir>       where the images go, ${OUT} by default`,
  "",
  "Examples:",
  "  node scripts/catalogue/shot.ts -p actions/button -t asphalt,prism -m light,dark",
  "  node scripts/catalogue/shot.ts -p layout/stack -s gaps -w 420,1024,3072",
  '  node scripts/catalogue/shot.ts -p actions/button -e "[data-recipe=button]" --state rest,hover,focus,active',
  '  node scripts/catalogue/shot.ts -p disclosure/menu --open "[data-recipe=menu] button" -e "[role=menu]"',
];

/**
 * Describes what the command was asked to capture, beyond the targets.
 */
interface Asked {
  /**
   * The element to capture, or nothing for the page or the scene.
   */
  readonly element: string;

  /**
   * Whether the whole page is captured rather than the fold.
   */
  readonly full: boolean;

  /**
   * The room left round a scene or an element, in CSS pixels, for a ring or a shadow outside its
   * box.
   */
  readonly margin: number;

  /**
   * Where the images go.
   */
  readonly out: string;

  /**
   * The scene named, or undefined.
   */
  readonly scene: string | undefined;

  /**
   * The states the element is captured in, none for one capture at rest.
   */
  readonly states: ReadonlyArray<(typeof STATES)[number]>;
}

/**
 * Reads what was asked off the values parsed.
 *
 * @throws {@link Error} When states are named without an element to put in them.
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
 * Captures one locator to a file, with animations held still and a margin round its box, so a
 * focus ring or a shadow drawn outside the box is in the image.
 *
 * @throws {@link Error} When the element has no box, which a hidden element has not.
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
 * Captures one open page as asked, and returns the paths written.
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
 * Captures every target named on the command line.
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
