/**
 * Runs the accessibility audit the testing kit runs, over a region of a live page.
 */

import { createRequire } from "node:module";
import { type Locator, type Page } from "playwright";

/**
 * Describes one element a violation was found on, as the audit reports it.
 */
interface Hit {
  /**
   * The selectors that reach the element, one per frame.
   */
  readonly target: readonly string[];
}

/**
 * Describes one violation as the audit reports it.
 */
interface Violation {
  /**
   * The rule's own explanation of the fault.
   */
  readonly help: string;

  /**
   * The rule that found it.
   */
  readonly id: string;

  /**
   * The severity the rule gives it, or nothing where the rule gives none.
   */
  readonly impact?: null | string;

  /**
   * The elements it was found on.
   */
  readonly nodes: readonly Hit[];
}

/**
 * Describes the audit's report.
 */
interface Report {
  /**
   * The violations found.
   */
  readonly violations: readonly Violation[];
}

/**
 * Describes the audit as the page sees it once its script is added.
 */
interface Audit {
  /**
   * Runs the audit over an element and answers what it found.
   */
  readonly run: (context: Element) => Promise<Report>;
}

declare global {
  /**
   * The page's window, with the audit on it once its script is added.
   */
  interface Window {
    /**
     * The audit, once its script is added to the page.
     */
    axe?: Audit;
  }
}

/**
 * Describes one finding of the audit.
 */
export interface Finding {
  /**
   * The rule's own explanation of the fault.
   */
  readonly help: string;

  /**
   * The rule that found it.
   */
  readonly id: string;

  /**
   * The severity the rule gives it.
   */
  readonly impact: string;

  /**
   * The elements it was found on, as selectors.
   */
  readonly targets: readonly string[];
}

/**
 * Runs the audit over the first element a locator finds.
 *
 * @param page - The open page, which the audit's script is added to.
 * @param root - The element to audit.
 * @returns The violations found, none for a clean region.
 * @throws {@link Error} When the audit's script did not load.
 */
export async function audited(page: Page, root: Locator): Promise<readonly Finding[]> {
  const require = createRequire(import.meta.url);

  await page.addScriptTag({ path: require.resolve("axe-core") });

  return root.first().evaluate(async (element) => {
    if (window.axe === undefined) throw new Error("the audit's script did not load");

    const { violations } = await window.axe.run(element);

    return violations.map((violation) => ({
      help: violation.help,
      id: violation.id,
      impact: violation.impact ?? "unknown",
      targets: violation.nodes.map((node) => node.target.join(" ")),
    }));
  });
}
