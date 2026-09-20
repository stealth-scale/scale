/**
 * Runs an accessibility audit over one scene and shapes what it found into what a reader needs.
 *
 * @remarks
 *   The audit is the same engine the specifications run, so a scene that passes here passes the
 *   gate. It is run against the element the scene was drawn into rather than the page, because a
 *   page reports the catalogue's own shell as well and a reader cannot tell which of the two they
 *   are looking at.
 *   Axe is loaded the first time a reader asks for an audit and not before. It is the largest
 *   thing the catalogue would ship, and a reader who never opens an audit should never pay for it.
 *   The rules the catalogue itself breaks are left on. A violation the shell causes is a violation,
 *   and turning the rule off to keep a scene green is how a component ships with one.
 */

import { type AxeResults, type ImpactValue, type Result, type RunOptions } from "axe-core";

/**
 * Selects how badly a rule was broken, as axe rates it.
 *
 * @remarks
 *   Axe's own type carries `null` for a rule it did not rate. A rating is either one of the four
 *   or missing, and `undefined` is how every other optional value in this package is missing, so
 *   the two are not both carried.
 */
export type Impact = Exclude<ImpactValue, null>;

/**
 * Ranks the impacts, worst first, which is the order a reader reads the findings in.
 */
const RANK: Readonly<Record<Impact, number>> = {
  critical: 0,
  minor: 3,
  moderate: 2,
  serious: 1,
};

/**
 * Ranks a finding axe left unrated, which sits under everything it rated.
 */
const UNRATED = 4;

/**
 * Fixes what the audit reads: every rule, and only the ones a scene can be held to.
 *
 * @remarks
 *   No tags are named, so every rule axe runs by default runs here: the WCAG levels, the best
 *   practices and the experimental ones alike.
 *   Four are turned off. A scene is a fragment of a document rather than a document, so the rules
 *   about the page as a whole cannot pass inside one. `region` asks every element to sit in a
 *   landmark, `landmark-one-main` asks for a main, `page-has-heading-one` asks for a first-level
 *   heading, and `bypass` asks for a skip link. All four are the catalogue's own to answer and none
 *   of them is the component's.
 *   Two are turned on that axe leaves off. `target-size` is WCAG 2.2 and newer than the set axe
 *   enables, and it is the one rule a library of controls most needs: it measures what a finger can
 *   actually hit. `aria-roledescription` costs nothing and catches a description written onto an
 *   element with no role to describe.
 *   The rest of what axe leaves off stays off. Two are AAA and would report every scene,
 *   `landmark-complementary-is-top-level` is another page-level rule, and the two about duplicate
 *   identifiers were deprecated when the criterion behind them was withdrawn.
 *   Each name is a rule axe knows. It rejects a run that names one it does not, so a rule renamed
 *   between versions takes every audit down rather than quietly staying on.
 */
const RULES: RunOptions = {
  rules: {
    "aria-roledescription": { enabled: true },
    bypass: { enabled: false },
    "landmark-one-main": { enabled: false },
    "page-has-heading-one": { enabled: false },
    region: { enabled: false },
    "target-size": { enabled: true },
  },
};

/**
 * Describes one element a rule was broken on.
 */
export interface Broken {
  /**
   * The line axe writes about what is wrong with this element.
   */
  readonly says: string;

  /**
   * The selector that finds it, which a reader pastes into the console to look at it.
   */
  readonly selector: string;
}

/**
 * Describes one rule a scene broke.
 */
export interface Finding {
  /**
   * How badly, as axe rates it, or nothing where it rated the rule at all.
   */
  readonly impact: Impact | undefined;

  /**
   * The elements the rule was broken on.
   */
  readonly on: readonly Broken[];

  /**
   * The rule's own identifier, such as `color-contrast`.
   */
  readonly rule: string;

  /**
   * The line axe writes about what the rule asks for.
   */
  readonly says: string;

  /**
   * Where the rule is written out in full.
   */
  readonly url: string;
}

/**
 * Describes what one audit came to.
 */
export interface Audit {
  /**
   * The rules that were broken, worst first.
   */
  readonly findings: readonly Finding[];

  /**
   * How many rules the scene was held to and passed.
   */
  readonly passed: number;
}

/**
 * Shapes one of axe's results into a finding.
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
 * Ranks a finding by how bad axe says it is.
 */
function ranked(finding: Finding): number {
  return finding.impact === undefined ? UNRATED : RANK[finding.impact];
}

/**
 * Runs the rules over an element and answers with what it found.
 */
export type Engine = (element: Element, options: RunOptions) => Promise<AxeResults>;

/**
 * Loads axe and returns its runner, bound to itself.
 */
async function engined(): Promise<Engine> {
  const { default: axe } = await import("axe-core");

  return axe.run.bind(axe);
}

/**
 * Audits one element and returns what the audit came to.
 *
 * @remarks
 *   The engine is a parameter so that a caller can hand over one of their own. Left out, axe is
 *   loaded here and used, which is what every caller in the catalogue does.
 * @param element - The element the scene was drawn into.
 * @param engine - The engine to run, or nothing for axe.
 * @returns The rules broken, worst first, and how many rules passed.
 */
export async function audited(element: Element, engine?: Engine): Promise<Audit> {
  const run = await (engine ?? (await engined()))(element, RULES);

  return {
    findings: run.violations
      .map((result) => found(result))
      .toSorted((a, b) => ranked(a) - ranked(b)),
    passed: run.passes.length,
  };
}
