/**
 * Runs axe, the engine the testing kit and the catalogue's Audit control use, over a region of a
 * live page.
 */

import { type RunOptions } from "axe-core";
import { createRequire } from "node:module";
import { type Locator, type Page } from "playwright";

/**
 * Element a violation was found on, as axe reports it.
 */
interface Hit {
  /**
   * Selectors that locate the element, one per frame.
   */
  readonly target: readonly string[];
}

/**
 * Violation as axe reports it.
 */
interface Violation {
  /**
   * Rule description from axe.
   */
  readonly help: string;

  /**
   * Rule id, such as `color-contrast`.
   */
  readonly id: string;

  /**
   * Severity, or null for a rule axe does not rate.
   */
  readonly impact?: null | string;

  /**
   * Elements the rule failed on.
   */
  readonly nodes: readonly Hit[];
}

/**
 * Report axe returns from a run.
 */
interface Report {
  /**
   * Rules that failed.
   */
  readonly violations: readonly Violation[];
}

/**
 * Region of the document axe reads: the elements the selectors match, less the elements the
 * excluding selectors match.
 */
interface Region {
  /**
   * Selectors of the elements to leave out, each wrapped the way axe takes a selector.
   */
  readonly exclude: ReadonlyArray<readonly string[]>;

  /**
   * Selectors of the elements to read, each wrapped the way axe takes a selector.
   */
  readonly include: ReadonlyArray<readonly string[]>;
}

/**
 * Global axe object the injected script defines.
 */
interface Audit {
  /**
   * Runs the enabled rules over an element or a region and resolves to the report.
   */
  readonly run: (context: Element | Region, options?: RunOptions) => Promise<Report>;
}

declare global {
  /**
   * Page window, extended with the global axe object.
   */
  interface Window {
    /**
     * Global axe object, defined once the script is injected.
     */
    axe?: Audit;
  }
}

/**
 * Violation reduced to what the command-line tools print.
 */
export interface Finding {
  /**
   * Rule description from axe.
   */
  readonly help: string;

  /**
   * Rule id, such as `color-contrast`.
   */
  readonly id: string;

  /**
   * Severity, or `unknown` for a rule axe does not rate.
   */
  readonly impact: string;

  /**
   * Selectors of the elements the rule failed on.
   */
  readonly targets: readonly string[];
}

/**
 * Injects axe into the page unless an earlier run did.
 */
async function injected(page: Page): Promise<void> {
  const present = await page.evaluate(() => window.axe !== undefined);

  if (present) return;

  const require = createRequire(import.meta.url);

  await page.addScriptTag({ path: require.resolve("axe-core") });
}

/**
 * Runs axe over the elements a list of selectors matches, less the elements a second list
 * matches.
 *
 * @param page - The open page.
 * @param include - Selectors of the elements to audit. The run reads nothing when none matches.
 * @param exclude - Selectors of the elements to leave out.
 * @param options - Run options passed to axe unchanged.
 * @returns Every violation, or an empty array.
 * @throws {@link Error} When the axe script fails to load.
 */
export async function auditedWithin(
  page: Page,
  include: readonly string[],
  exclude: readonly string[],
  options: RunOptions,
): Promise<readonly Finding[]> {
  await injected(page);

  return page.evaluate(
    async ({ given, left, read }) => {
      if (window.axe === undefined) throw new Error("the axe script did not load");
      if (!read.some((selector) => document.querySelector(selector) !== null)) return [];

      const region = {
        exclude: left.map((selector) => [selector]),
        include: read.map((selector) => [selector]),
      };
      const { violations } = await window.axe.run(region, given);

      return violations.map((violation) => ({
        help: violation.help,
        id: violation.id,
        impact: violation.impact ?? "unknown",
        targets: violation.nodes.map((node) => node.target.join(" ")),
      }));
    },
    { given: options, left: [...exclude], read: [...include] },
  );
}

/**
 * Injects axe into the page and runs it over the first element a locator matches.
 *
 * @param page - The open page.
 * @param root - Element to audit.
 * @param options - Run options passed to axe unchanged. Axe applies its defaults when omitted.
 * @returns Every violation, or an empty array.
 * @throws {@link Error} When the axe script fails to load.
 */
export async function audited(
  page: Page,
  root: Locator,
  options?: RunOptions,
): Promise<readonly Finding[]> {
  await injected(page);

  return root.first().evaluate(async (element, given) => {
    if (window.axe === undefined) throw new Error("the axe script did not load");

    const { violations } = await window.axe.run(element, given);

    return violations.map((violation) => ({
      help: violation.help,
      id: violation.id,
      impact: violation.impact ?? "unknown",
      targets: violation.nodes.map((node) => node.target.join(" ")),
    }));
  }, options);
}
