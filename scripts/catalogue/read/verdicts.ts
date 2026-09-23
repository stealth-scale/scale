/**
 * Runs the page review checks on an open catalogue page and returns one verdict per check.
 *
 * @remarks
 *   Every check reads the whole document, chrome included. The axe run adds
 *   `label-content-name-mismatch` to the catalogue's scene rules, and `landmark-unique` then covers
 *   landmark names across scenes and the chrome.
 */

import { type Page } from "playwright";

// eslint-disable-next-line import/no-relative-parent-imports -- the specimen package does not export the rules its Audit control runs, and the review must run the same ones
import { RULES } from "../../../components/specimen/src/catalogue/audited.ts";
import { audited } from "./audit.ts";
import { propped, sourced } from "./bands.ts";
import { overflowing, unaligned } from "./layout.ts";
import { outlined } from "./outline.ts";

/**
 * Axe run options: the catalogue's scene rules plus `label-content-name-mismatch`, which axe
 * leaves off by default and which enforces WCAG 2.5.3.
 */
const AXE = { rules: { ...RULES.rules, "label-content-name-mismatch": { enabled: true } } };

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
 * Runs axe over the whole document and prefixes each violation with the title of the scene that
 * contains it, or `chrome` outside every scene.
 */
async function accessible(page: Page): Promise<Verdict> {
  const findings = await audited(page, page.locator("html"), AXE);
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
