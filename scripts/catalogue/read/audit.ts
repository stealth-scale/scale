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
 * Global axe object the injected script defines.
 */
interface Audit {
  /**
   * Runs the enabled rules over an element and resolves to the report.
   */
  readonly run: (context: Element, options?: RunOptions) => Promise<Report>;
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
  const require = createRequire(import.meta.url);

  await page.addScriptTag({ path: require.resolve("axe-core") });

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
