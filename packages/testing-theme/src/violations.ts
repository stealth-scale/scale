/**
 * Runs every check a theme has to pass and reports each violation as one sentence.
 *
 * @remarks
 *   No check short-circuits another, so one run reports the whole set rather than the first thing
 *   that broke. Skipping a check costs a written reason.
 */

import { FLOOR, type Preset, type Theme } from "@stealthscale/theme/authoring";

import * as contract from "#contract.ts";
import * as contrast from "#contrast.ts";
import * as distinct from "#distinct.ts";
import { installed } from "#fonts.ts";
import { gated } from "#gate.ts";
import * as ramp from "#ramp.ts";
import { type Declared } from "#recipe.ts";
import * as series from "#series.ts";
import * as status from "#status.ts";

/**
 * Every check a theme specification can select or skip, keyed as `<module>.<check>`.
 */
export type ThemeCheck =
  | "contract.compounds"
  | "contract.extensions"
  | "contract.listed"
  | "contract.modes"
  | "contract.references"
  | "contract.roles"
  | "contract.styles"
  | "contract.variants"
  | "contrast.boundary"
  | "contrast.focus"
  | "contrast.text"
  | "distinct.fills"
  | "distinct.inks"
  | "distinct.lines"
  | "distinct.surfaces"
  | "fonts.installed"
  | "name.attribute"
  | "ramp.hue"
  | "ramp.monotonic"
  | "series.distinct"
  | "status.distinct"
  | "status.identity";

/**
 * The context a theme specification passes alongside the theme. Every field is optional, and
 * omitting one turns off the checks that need it.
 */
export interface ThemeChecks {
  /**
   * The theme package's source directory. Given it, every file under `recipes/` and `slot-recipes/`
   * that exports `extension` has to be listed in the theme, and a font package has to resolve from
   * the package.
   */
  at?: string | undefined;

  /**
   * The preset the theme is layered on, read for the scales a reference names and the theme does
   * not restate.
   */
  base?: Preset | undefined;

  /**
   * The recipe keys the workspace publishes, either as a list or as a map from each key to its
   * recipe. An extension naming any other key is reported. The map buys two more checks, against
   * the variants and the compound selections the recipe actually declares.
   */
  recipes?: Readonly<Record<string, Declared>> | readonly string[] | undefined;

  /**
   * The checks to skip, each against the reason a reviewer can weigh.
   */
  skip?: Readonly<Partial<Record<ThemeCheck, string>>> | undefined;

  /**
   * The ratio each class of pair has to meet and the distance each class of step has to keep,
   * over the defaults from WCAG 1.4.3, 1.4.6 and 1.4.11 and the foundation's ladders. A theme whose
   * declared ink is below the text ratio on its declared page records the ratio it measures here,
   * with its reason.
   */
  thresholds?: Partial<contrast.Thresholds> | undefined;
}

/**
 * The shape of a theme name a page can write into the attribute: lower case, starting on a letter,
 * hyphens and digits after that.
 */
const ATTRIBUTE_VALUE = /^[a-z][a-z0-9-]*$/u;

/**
 * Narrows the recipes to the list form, which contains keys alone.
 */
function isKeys(recipes: NonNullable<ThemeChecks["recipes"]>): recipes is readonly string[] {
  return Array.isArray(recipes);
}

/**
 * The recipe keys the specification declares, read out of either form it can take.
 */
function keysOf(options: ThemeChecks): readonly string[] | undefined {
  if (options.recipes === undefined) return undefined;

  return isKeys(options.recipes) ? options.recipes : Object.keys(options.recipes);
}

/**
 * Runs the compounds check, and nothing where the specification lists keys without their recipes.
 */
function compoundsOf(theme: Theme, options: ThemeChecks): readonly string[] {
  if (options.recipes === undefined || isKeys(options.recipes)) return [];

  return contract.compounds(theme, options.recipes);
}

/**
 * Runs the variants check, and nothing where the specification lists keys without their recipes.
 */
function variantsOf(theme: Theme, options: ThemeChecks): readonly string[] {
  if (options.recipes === undefined || isKeys(options.recipes)) return [];

  return contract.variants(theme, options.recipes);
}

/**
 * The signature every check is called through: theme and context in, violations out.
 */
type Runner = (theme: Theme, options: ThemeChecks) => readonly string[];

/**
 * Each check against the call that performs it. The order here is the order violations report in.
 */
const RUNNERS: ReadonlyArray<readonly [ThemeCheck, Runner]> = [
  [
    "name.attribute",
    (theme) =>
      ATTRIBUTE_VALUE.test(theme.name) ? [] : [`${theme.name} is not a valid attribute value`],
  ],
  ["contract.roles", (theme) => contract.roles(theme)],
  ["contract.modes", (theme) => contract.modes(theme)],
  ["contract.references", (theme, options) => contract.references(theme, options)],
  ["contract.extensions", (theme, options) => contract.extensions(theme, keysOf(options))],
  ["contract.variants", variantsOf],
  ["contract.compounds", compoundsOf],
  [
    "contract.listed",
    (theme, options) => (options.at === undefined ? [] : contract.listed(theme, options.at)),
  ],
  ["contract.styles", (theme) => contract.styles(theme)],
  ["contrast.text", (theme, options) => contrast.text(theme, options, thresholdsOf(options))],
  [
    "contrast.boundary",
    (theme, options) => contrast.boundary(theme, options, thresholdsOf(options)),
  ],
  ["contrast.focus", (theme, options) => contrast.focus(theme, options, thresholdsOf(options))],
  [
    "distinct.surfaces",
    (theme, options) => distinct.surfaces(theme, options, thresholdsOf(options)),
  ],
  ["distinct.inks", (theme, options) => distinct.inks(theme, options, thresholdsOf(options))],
  ["distinct.lines", (theme, options) => distinct.lines(theme, options, thresholdsOf(options))],
  ["distinct.fills", (theme, options) => distinct.fills(theme, options, thresholdsOf(options))],
  ["status.distinct", (theme, options) => status.distinct(theme, options, thresholdsOf(options))],
  ["status.identity", (theme, options) => status.identity(theme, options, thresholdsOf(options))],
  ["series.distinct", (theme, options) => series.distinct(theme, options, thresholdsOf(options))],
  ["ramp.monotonic", (theme) => ramp.monotonic(theme)],
  ["ramp.hue", (theme, options) => ramp.hue(theme, thresholdsOf(options))],
  ["fonts.installed", (theme, options) => installed(theme, options.at)],
];

/**
 * Fills in every threshold the specification omits, then clamps its five contrast ratios at the
 * four accessibility floors.
 *
 * @remarks
 *   A specification declares thresholds to record what its theme aims for, and the engine builds to
 *   the same numbers, so a specification could otherwise lower a ratio until its theme passed.
 *   Neither may go below what WCAG requires of normal-size text or of the visual information that
 *   identifies a control. The clamp reports a theme whose colors fall below the floor, instead of
 *   measuring it against a lower ratio. The distances, the hues and the hairline are quality
 *   targets, so a specification moves those freely.
 */
function thresholdsOf(options: ThemeChecks): contrast.Thresholds {
  const stated = { ...contrast.THRESHOLDS, ...options.thresholds };

  return {
    ...stated,
    boundary: Math.max(stated.boundary, FLOOR.boundary),
    focus: Math.max(stated.focus, FLOOR.boundary),
    label: Math.max(stated.label, FLOOR.label),
    tertiary: Math.max(stated.tertiary, FLOOR.tertiary),
    text: Math.max(stated.text, FLOOR.text),
  };
}

/**
 * Runs every check the specification does not skip against a theme.
 *
 * @returns Each violation, prefixed with the check that reported it, or an empty array for a theme
 *   that keeps the contract.
 */
export function violations(theme: Theme, options: ThemeChecks = {}): readonly string[] {
  return gated(
    RUNNERS.map(([check, run]) => [check, () => run(theme, options)] as const),
    options,
  );
}
