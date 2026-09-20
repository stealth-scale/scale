/**
 * Runs every check a theme is held to and reports each breach as one sentence.
 *
 * @remarks
 *   Every selected check runs, and a breach found by one never stops another, so a specification
 *   reports the whole set in a single run. Skipping a check costs a written reason.
 */

import { FLOOR, type Preset, type Theme } from "@stealthscale/theme/authoring";

import * as contract from "#contract.ts";
import * as contrast from "#contrast.ts";
import * as distinct from "#distinct.ts";
import { installed } from "#fonts.ts";
import { gated } from "#gate.ts";
import * as ramp from "#ramp.ts";
import { type Declared } from "#recipe.ts";
import * as status from "#status.ts";

/**
 * Enumerates every check a theme specification can select or skip.
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
  | "status.distinct"
  | "status.identity";

/**
 * Describes what a theme specification states beside the theme.
 */
export interface ThemeChecks {
  /**
   * The theme package's source directory. With it, every file under `recipes/` and
   * `slot-recipes/` that exports `extension` has to be listed in the theme, and a font package has
   * to resolve from the package.
   */
  at?: string | undefined;

  /**
   * The preset the theme is layered on, read for the scales a reference names and the theme does
   * not restate.
   */
  base?: Preset | undefined;

  /**
   * The recipe keys the workspace publishes, as a list, or as a map from each key to its recipe.
   * An extension naming any other key is reported, and with the map, so is a compound whose
   * selection the recipe does not declare.
   */
  recipes?: Readonly<Record<string, Declared>> | readonly string[] | undefined;

  /**
   * The checks to leave out, each with a reason a reviewer can weigh.
   */
  skip?: Readonly<Partial<Record<ThemeCheck, string>>> | undefined;

  /**
   * The ratio each class of pair is held to and the distance each class of step is held apart,
   * over the defaults from WCAG 1.4.3, 1.4.6 and 1.4.11 and the foundation's own ladders. A theme
   * whose stated ink cannot reach the text ratio on its stated page states the ratio it draws
   * to here, with the reason beside it.
   */
  thresholds?: Partial<contrast.Thresholds> | undefined;
}

/**
 * Matches a name a page can write as the value of the theme attribute.
 */
const ATTRIBUTE_VALUE = /^[a-z][a-z0-9-]*$/u;

/**
 * Reports whether the recipes were stated as a list of keys rather than a map.
 */
function isKeys(recipes: NonNullable<ThemeChecks["recipes"]>): recipes is readonly string[] {
  return Array.isArray(recipes);
}

/**
 * Lists the recipe keys the specification states, in either form.
 */
function keysOf(options: ThemeChecks): readonly string[] | undefined {
  if (options.recipes === undefined) return undefined;

  return isKeys(options.recipes) ? options.recipes : Object.keys(options.recipes);
}

/**
 * Reports a theme's unapplied compounds where the specification maps each key to its recipe.
 */
function compoundsOf(theme: Theme, options: ThemeChecks): readonly string[] {
  if (options.recipes === undefined || isKeys(options.recipes)) return [];

  return contract.compounds(theme, options.recipes);
}

/**
 * Runs the variants check where the specification maps each key to its recipe, and nothing
 * where it lists keys alone.
 */
function variantsOf(theme: Theme, options: ThemeChecks): readonly string[] {
  if (options.recipes === undefined || isKeys(options.recipes)) return [];

  return contract.variants(theme, options.recipes);
}

/**
 * Runs one check and reports what it found.
 */
type Runner = (theme: Theme, options: ThemeChecks) => readonly string[];

/**
 * Maps each check to the call that performs it, in the order they report.
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
  ["ramp.monotonic", (theme) => ramp.monotonic(theme)],
  ["ramp.hue", (theme, options) => ramp.hue(theme, thresholdsOf(options))],
  ["fonts.installed", (theme, options) => installed(theme, options.at)],
];

/**
 * Fills in every threshold the specification did not state, and holds the four a reader depends
 * on at the floor.
 *
 * @remarks
 *   A specification states thresholds to say what its theme aims for, and the engine draws to the
 *   same numbers. Neither may go below what WCAG asks of normal-size text and of the visual
 *   information that identifies a control, so a theme whose colors cannot reach the floor is
 *   reported rather than measured against a lower one. The distances, the hues and the hairline
 *   are quality targets and a specification moves them freely.
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
 * Runs every check the specification leaves standing over a theme.
 *
 * @returns Each violation, opening with the check that reported it, or an empty array for a theme
 *   that keeps the contract.
 */
export function violations(theme: Theme, options: ThemeChecks = {}): readonly string[] {
  return gated(
    RUNNERS.map(([check, run]) => [check, () => run(theme, options)] as const),
    options,
  );
}
