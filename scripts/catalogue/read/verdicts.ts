/**
 * Runs the page review checks on an open catalogue page and returns one verdict per check.
 *
 * @remarks
 *   Every check reads the whole document, chrome included. Axe runs twice, both times with
 *   `label-content-name-mismatch` on. The first run reads the chrome with the landmark placement
 *   rules on and leaves the scenes out. The second run reads the scenes with the catalogue's scene
 *   rules, which turn the landmark placement rules off.
 */

import { type Page } from "playwright";

// eslint-disable-next-line import/no-relative-parent-imports -- the specimen package does not export the rules its Audit control runs, and the review must run the same ones
import { LANDMARK_RULES, RULES } from "../../../components/specimen/src/catalogue/audited.ts";
import { auditedWithin } from "./audit.ts";
import { propped, sourced } from "./bands.ts";
import { overflowing, unaligned } from "./layout.ts";
import { outlined } from "./outline.ts";

/**
 * Selector of the element each scene renders into.
 */
const SCENES = "main section[id] > .section__body";

/**
 * Run options of the scene audit, which add `label-content-name-mismatch` (WCAG 2.5.3) to the
 * catalogue's scene rules and keep its other options.
 */
const AXE = {
  ...RULES,
  rules: { ...RULES.rules, "label-content-name-mismatch": { enabled: true } },
};

/**
 * Run options of the chrome audit, which turn every rule in `LANDMARK_RULES` on over the scene
 * options.
 */
const CHROME = {
  ...AXE,
  rules: {
    ...AXE.rules,
    ...Object.fromEntries(LANDMARK_RULES.map((rule) => [rule, { enabled: true }])),
  },
};

/**
 * Result of one check on one page.
 */
export interface Verdict {
  /**
   * Faults found, or an empty array when the check passed.
   */
  readonly faults: readonly string[];

  /**
   * Check name, as printed.
   */
  readonly name: string;

  /**
   * Summary printed when the check passed.
   */
  readonly note: string;
}

/**
 * Runs a reading with every scene hidden from screen readers, and shows the scenes again after it.
 *
 * @remarks
 *   Axe counts the `main`, `banner` and `contentinfo` landmarks of the whole document for its
 *   duplication rules, whatever region a run excludes, and skips an element hidden from screen
 *   readers. A scene that renders an application's `main` then leaves the catalogue's own `main`
 *   as the only one the chrome run counts. The chrome run excludes the scenes, so no rule reads
 *   the hidden elements.
 * @param page - The open page.
 * @param read - The reading to run.
 * @returns The reading's result.
 */
async function withoutScenes<T>(page: Page, read: () => Promise<T>): Promise<T> {
  /**
   * Sets `aria-hidden` on every scene, or removes it.
   */
  const hide = (hidden: boolean): Promise<void> =>
    page.evaluate(
      ({ hidden: on, selector }) => {
        for (const scene of document.querySelectorAll(selector)) {
          if (on) scene.setAttribute("aria-hidden", "true");
          else scene.removeAttribute("aria-hidden");
        }
      },
      { hidden, selector: SCENES },
    );

  await hide(true);

  try {
    return await read();
  } finally {
    await hide(false);
  }
}

/**
 * Runs axe over the chrome and over the scenes, and names in each fault the title of the scene
 * that contains it, or `chrome`.
 */
async function accessible(page: Page): Promise<Verdict> {
  const findings = [
    ...(await withoutScenes(page, () => auditedWithin(page, ["html"], [SCENES], CHROME))),
    ...(await auditedWithin(page, [SCENES], [], AXE)),
  ];
  const pairs = findings.flatMap((finding) =>
    finding.targets.map((target) => ({ finding, target })),
  );
  const scenes = await page.evaluate(
    (selectors) =>
      selectors.map((selector) => {
        try {
          const section = document.querySelector(selector)?.closest("main section[id]");

          return section?.querySelector("h2")?.textContent?.trim() ?? "chrome";
        } catch {
          return "chrome";
        }
      }),
    pairs.map((pair) => pair.target),
  );
  const faults = pairs.map(
    ({ finding, target }, index) =>
      `${finding.id} (${finding.impact}) in ${scenes[index] ?? "chrome"}: ${target}`,
  );

  return { faults, name: "axe", note: "no violations" };
}

/**
 * Runs every check on an open page.
 *
 * @remarks
 *   The Source panels open after the axe and layout readings, and the Props tab opens last, so no
 *   check changes the page an earlier check reads. Console errors are read last, so errors logged
 *   while the panels open are included.
 * @param page - The open page.
 * @param errors - Console errors the page reports, a live array the page keeps appending to.
 * @returns One verdict per check, in the order the checks ran.
 */
export async function checked(page: Page, errors: readonly string[]): Promise<readonly Verdict[]> {
  const raw = (await outlined(page.locator("main"))).raw;
  const axe = await accessible(page);
  const overflow = await overflowing(page);
  const columns = await unaligned(page);
  const sources = await sourced(page);
  const props = await propped(page);

  return [
    axe,
    { faults: overflow, name: "overflow", note: "none" },
    { faults: columns, name: "columns", note: "aligned" },
    { ...sources, name: "sources" },
    { ...props, name: "props" },
    { faults: raw, name: "raw keys", note: "none" },
    { faults: [...errors], name: "console", note: "no errors" },
  ];
}
