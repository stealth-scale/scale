/**
 * Runs the page review checks on catalogue pages and exits with 1 when any page fails one.
 *
 * @remarks
 *   Each page is opened in light and in dark unless `--mode` names a mode, in one browser, one page
 *   after another. `--help` lists the checks, and `read/verdicts.ts` runs them.
 *   Usage: `node scripts/catalogue/review.ts --page components/data/badge,components/data/tag`,
 *   plus the options `--help` lists.
 */

import { eachOpened } from "./browse.ts";
import { flagAt, parsed, resolved, SHARED_HELP, slugOf, stringAt } from "./options.ts";
import { checked, type Verdict } from "./read/verdicts.ts";

/**
 * Colour modes a page is reviewed in when `--mode` names none.
 */
const MODES = "light,dark";

/**
 * Options this command adds to the shared ones.
 */
const OWN = { json: { default: false, short: "j", type: "boolean" } } as const;

/**
 * Help text the command prints for `--help`.
 */
const HELP = [
  "Runs the page review checks on catalogue pages and exits with 1 when any page fails one.",
  "",
  "Usage: node scripts/catalogue/review.ts --page <id>[,<id>] [options]",
  "",
  ...SHARED_HELP.filter((line) => !line.includes("--scene")),
  "  -j, --json            print JSON instead of text",
  "",
  "Checks, over the whole document:",
  "  axe       the catalogue's scene rules plus label-content-name-mismatch",
  "  overflow  recipe slots whose content is wider than their box",
  "  columns   sibling rows whose last parts end at different distances",
  "  sources   a Source for every scene, with no {...props}, props.<name> or # import",
  "  props     a Props tab that lists parts",
  "  raw keys  text rendered as an untranslated key",
  "  console   errors logged while the checks ran",
];

/**
 * Results of every check on one target.
 */
interface Reviewed {
  /**
   * Target slug: page, theme, mode, width and emulated media.
   */
  readonly target: string;

  /**
   * One verdict per check, in the order the checks ran.
   */
  readonly verdicts: readonly Verdict[];
}

/**
 * Formats one target's verdicts as text, one line per check and one indented line per fault.
 */
function printed(one: Reviewed): string {
  const lines = [`== ${one.target}`];

  for (const verdict of one.verdicts) {
    const passed = verdict.faults.length === 0;
    const summary = passed ? verdict.note : `${String(verdict.faults.length)} faults`;

    lines.push(`  ${passed ? "pass" : "FAIL"}  ${verdict.name.padEnd(9)} ${summary}`);

    for (const fault of verdict.faults) lines.push(`          ${fault}`);
  }

  return lines.join("\n");
}

/**
 * Reviews every target named on the command line and sets exit code 1 when any check fails.
 *
 * @throws {@link Error} When `--scene` is given, because every check reads the whole page.
 */
async function main(): Promise<void> {
  const values = parsed(OWN, process.argv.slice(2));

  if (flagAt(values, "help")) {
    console.log(HELP.join("\n"));

    return;
  }

  if (stringAt(values, "scene") !== "") {
    throw new Error("--scene is not supported; review reads whole pages");
  }

  const json = flagAt(values, "json");
  const { targets } = resolved({ ...values, mode: stringAt(values, "mode") || MODES });
  const all: Reviewed[] = [];

  await eachOpened(targets, async ({ errors, page }, target) => {
    const one = { target: slugOf(target), verdicts: await checked(page, errors) };

    all.push(one);
    if (!json) console.log(printed(one));
  });

  const failed = all.filter((one) => one.verdicts.some((verdict) => verdict.faults.length > 0));

  console.log(
    json
      ? JSON.stringify(all, null, 2)
      : `\n${String(failed.length)} of ${String(all.length)} targets failed`,
  );

  if (failed.length > 0) process.exitCode = 1;
}

try {
  await main();
} catch (error) {
  console.error(
    `error: ${error instanceof Error ? (error.message.split("\n")[0] ?? "") : String(error)}`,
  );
  process.exitCode = 1;
}
