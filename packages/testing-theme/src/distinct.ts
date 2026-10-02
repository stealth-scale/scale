/**
 * Checks that consecutive surfaces, fills, inks and lines differ in lightness by at least a
 * minimum.
 *
 * @remarks
 *   The contrast gate only ever reads a text against its surface. It says nothing about two
 *   adjacent surfaces, so a theme that puts a hovered fill on the same step as the fill at rest
 *   passes every text pair and still renders a hover nobody can see. Distance is measured on the
 *   OKLab lightness axis, the axis the foundation's ladders are stepped along.
 */

import { MODES, type Theme } from "@stealthscale/theme/authoring";

import { type Thresholds } from "#contrast.ts";
import { lightnessAt, palettesOf, type Resolving } from "#theme.ts";

/**
 * The surface pairs that have to differ: the page against the raised surface and against the first
 * well, the raised surfaces against the first well, and each well against the next.
 *
 * @remarks
 *   The panel and the popover are deliberately not paired. Both clamp at white on a light page, and
 *   a shadow already separates a floating surface from a raised one.
 */
const SURFACE_STEPS: ReadonlyArray<readonly [string, string]> = [
  ["bg", "bg.panel"],
  ["bg", "bg.subtle"],
  ["bg.panel", "bg.subtle"],
  ["bg.popover", "bg.subtle"],
  ["bg.subtle", "bg.muted"],
  ["bg.muted", "bg.emphasized"],
];

/**
 * The ink pairs, in the order the inks fade.
 */
const INK_STEPS: ReadonlyArray<readonly [string, string]> = [
  ["fg", "fg.muted"],
  ["fg.muted", "fg.subtle"],
];

/**
 * The line pairs, running from the lightest border to the heaviest.
 */
const LINE_STEPS: ReadonlyArray<readonly [string, string]> = [
  ["border.subtle", "border.muted"],
  ["border.muted", "border"],
  ["border", "border.emphasized"],
];

/**
 * The pairs within one palette that have to differ: the three quiet fills, the solid against its
 * hover, and the line against its hover.
 */
const PALETTE_STEPS: ReadonlyArray<readonly [string, string]> = [
  ["subtle", "muted"],
  ["muted", "emphasized"],
  ["solid", "solid.hover"],
  ["border", "border.hover"],
];

/**
 * The surfaces a palette's resting fill has to differ from, so a subtle control stays visible on
 * the page, on a card and on a menu.
 */
const FILL_SURFACES = ["bg", "bg.panel", "bg.popover"];

/**
 * Measures every pair in both modes and reports the ones below the minimum, along with any pair
 * that could not be measured at all.
 */
function apart(
  theme: Theme,
  pairs: ReadonlyArray<readonly [string, string]>,
  options: Resolving,
  minimum: number,
): readonly string[] {
  return MODES.flatMap((mode) =>
    pairs.flatMap(([one, other]) => {
      const first = lightnessAt(theme, one, mode, options);
      const second = lightnessAt(theme, other, mode, options);

      if (first === undefined || second === undefined) {
        return [`${theme.name} ${one} and ${other} cannot be measured in ${mode}`];
      }

      const distance = Math.abs(first - second);

      if (distance >= minimum) return [];

      return [
        `${theme.name} ${one} and ${other} differ by ${distance.toFixed(3)} in ${mode}, below ${String(minimum)}`,
      ];
    }),
  );
}

/**
 * Reports the surface pairs that sit closer in lightness than the minimum.
 */
export function surfaces(
  theme: Theme,
  options: Resolving,
  thresholds: Thresholds,
): readonly string[] {
  return apart(theme, SURFACE_STEPS, options, thresholds.distinct);
}

/**
 * Reports the consecutive ink pairs that sit closer in lightness than the minimum.
 */
export function inks(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  return apart(theme, INK_STEPS, options, thresholds.distinct);
}

/**
 * Reports the consecutive line pairs that sit closer in lightness than the minimum.
 */
export function lines(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  return apart(theme, LINE_STEPS, options, thresholds.distinct);
}

/**
 * Reports, for every palette, the pairs that sit closer in lightness than the minimum: a fill and
 * the next, a solid and its hover, a line and its hover, or the resting fill and a surface it sits
 * on.
 */
export function fills(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  return palettesOf(theme).flatMap((palette) =>
    apart(
      theme,
      [
        ...PALETTE_STEPS.map(
          ([one, other]) => [`${palette}.${one}`, `${palette}.${other}`] as const,
        ),
        ...FILL_SURFACES.map((surface) => [`${palette}.subtle`, surface] as const),
      ],
      options,
      thresholds.distinct,
    ),
  );
}
