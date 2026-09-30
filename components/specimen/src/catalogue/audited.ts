/**
 * Runs an accessibility audit over one scene and returns its findings, worst first.
 *
 * @remarks
 *   The audit runs axe, the engine the specifications run, so a scene that passes here passes the
 *   gate. It reads the element the scene renders into, so no finding comes from the catalogue's
 *   shell. The catalogue loads axe on the first audit a reader requests, because axe is the largest
 *   module in the catalogue's bundle.
 */

import {
  type AxeResults,
  type ImpactValue,
  type Result,
  type RunOptions,
} from "#catalogue/types.ts";

/**
 * Lists the four ratings axe gives a broken rule.
 *
 * @remarks
 *   Axe types an unrated rule's impact as `null`. This package writes a missing value as
 *   `undefined`, so the type leaves `null` out.
 */
export type Impact = Exclude<ImpactValue, null>;

/**
 * Sort position of each impact, worst first.
 */
const RANK: Readonly<Record<Impact, number>> = {
  critical: 0,
  minor: 3,
  moderate: 2,
  serious: 1,
};

/**
 * Sort position of a finding axe left unrated, after every rated finding.
 */
const UNRATED = 4;

/**
 * Lists the axe rules that check where a landmark is placed and whether a landmark repeats.
 *
 * @remarks
 *   A scene renders a fragment of an application inside the catalogue's page. Its main region is
 *   nested in the catalogue's `main`, and a page shown wide and at a phone's width repeats each of
 *   its landmarks. These rules judge a whole document, so the scene audit turns them off and the
 *   catalogue review applies them to the chrome only.
 */
export const LANDMARK_RULES: readonly string[] = [
  "landmark-banner-is-top-level",
  "landmark-contentinfo-is-top-level",
  "landmark-main-is-top-level",
  "landmark-no-duplicate-banner",
  "landmark-no-duplicate-contentinfo",
  "landmark-no-duplicate-main",
  "landmark-unique",
];

/**
 * Lists the axe rules a scene audit turns on and off.
 *
 * @remarks
 *   The options do not list tags, so axe runs its WCAG, best-practice and experimental rules. They
 *   turn off the eleven rules that judge a whole document: `region`, `landmark-one-main`,
 *   `page-has-heading-one`, `bypass` and the seven in {@link LANDMARK_RULES}. They turn on
 *   `target-size` (WCAG 2.5.8) and `aria-roledescription`, which axe leaves off. Every other rule
 *   axe leaves off remains off. Axe rejects options that reference an unknown rule, so a rule
 *   renamed in an axe release fails every audit. `iframes` is off: no frame on a page carries axe,
 *   so axe audits none of their documents, and its message to a sandboxed frame, whose origin is
 *   `null`, logs an error in the console.
 */
export const RULES: RunOptions = {
  iframes: false,
  rules: {
    "aria-roledescription": { enabled: true },
    bypass: { enabled: false },
    "landmark-banner-is-top-level": { enabled: false },
    "landmark-contentinfo-is-top-level": { enabled: false },
    "landmark-main-is-top-level": { enabled: false },
    "landmark-no-duplicate-banner": { enabled: false },
    "landmark-no-duplicate-contentinfo": { enabled: false },
    "landmark-no-duplicate-main": { enabled: false },
    "landmark-one-main": { enabled: false },
    "landmark-unique": { enabled: false },
    "page-has-heading-one": { enabled: false },
    region: { enabled: false },
    "target-size": { enabled: true },
  },
};

/**
 * Describes one element a rule failed on.
 */
export interface Broken {
  /**
   * Axe's summary of the failure on this element.
   */
  readonly says: string;

  /**
   * Selector that locates the element, for a reader to paste into the console.
   */
  readonly selector: string;
}

/**
 * Describes one rule a scene broke.
 */
export interface Finding {
  /**
   * Rating axe gave the rule, or undefined when axe left it unrated.
   */
  readonly impact: Impact | undefined;

  /**
   * Elements the rule failed on.
   */
  readonly on: readonly Broken[];

  /**
   * Rule id, such as `color-contrast`.
   */
  readonly rule: string;

  /**
   * Axe's description of what the rule requires.
   */
  readonly says: string;

  /**
   * Address of the rule's documentation.
   */
  readonly url: string;
}

/**
 * Describes the result of one audit.
 */
export interface Audit {
  /**
   * Broken rules, worst first.
   */
  readonly findings: readonly Finding[];

  /**
   * Number of rules the scene passed.
   */
  readonly passed: number;
}

/**
 * Converts one axe result into a finding.
 */
function found(result: Result): Finding {
  return {
    impact: result.impact ?? undefined,
    on: result.nodes.map((node) => ({
      says: node.failureSummary ?? result.help,
      selector: node.target.join(" "),
    })),
    rule: result.id,
    says: result.help,
    url: result.helpUrl,
  };
}

/**
 * Returns the sort position of a finding's impact.
 */
function ranked(finding: Finding): number {
  return finding.impact === undefined ? UNRATED : RANK[finding.impact];
}

/**
 * Runs the rules over an element and resolves to axe's results.
 */
export type Engine = (element: Element, options: RunOptions) => Promise<AxeResults>;

/**
 * Loads axe and returns its `run` method bound to axe.
 */
async function engined(): Promise<Engine> {
  const { default: axe } = await import("axe-core");

  return axe.run.bind(axe);
}

/**
 * Describes the options of an audit beyond the element.
 */
export interface Auditing {
  /**
   * Engine to run, or axe, loaded on the first run, when absent.
   */
  readonly engine?: Engine | undefined;

  /**
   * Run options passed to the engine, or {@link RULES} when absent.
   */
  readonly rules?: RunOptions | undefined;
}

/**
 * Audits one element and returns the broken rules and the number of rules it passed.
 *
 * @remarks
 *   An application states its own rules through `Placing.audit`. Every audit in the catalogue runs
 *   axe with {@link RULES}.
 * @param element - Element the scene renders into.
 * @param auditing - Engine and rules, each optional.
 * @returns The broken rules, worst first, and the number of rules that passed.
 */
export async function audited(element: Element, auditing: Auditing = {}): Promise<Audit> {
  const run = await (auditing.engine ?? (await engined()))(element, auditing.rules ?? RULES);

  return {
    findings: run.violations
      .map((result) => found(result))
      .toSorted((a, b) => ranked(a) - ranked(b)),
    passed: run.passes.length,
  };
}
