/**
 * Measures whether the steps a page and a palette are drawn from can be told apart: consecutive
 * surfaces, fills, inks and lines differ in lightness by at least a minimum.
 *
 * @remarks
 *   The contrast gate reads a pair of a text and its surface. It says nothing about two surfaces
 *   beside each other, and a theme that places a hovered fill on the same step as the fill at rest
 *   passes every text pair with a hover that no reader sees. The distance is measured on the OKLab
 *   lightness axis, which is the axis the foundation's own ladders are stepped along.
 */

import { MODES, type Theme } from "@stealthscale/theme/authoring";

import { type Thresholds } from "#contrast.ts";
import { lightnessAt, palettesOf, type Resolving } from "#theme.ts";

/**
 * Lists the surfaces a reader tells apart: the page from the raised surface and from the first
 * well, the raised surfaces from the first well, and each well from the next.
 *
 * @remarks
 *   The panel and the popover are not paired, because both clamp at white on a light page and a
 *   floating surface is told from a raised one by its shadow.
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
 * Lists the inks in the order they fade.
 */
const INK_STEPS: ReadonlyArray<readonly [string, string]> = [
  ["fg", "fg.muted"],
  ["fg.muted", "fg.subtle"],
];

/**
 * Lists the lines in the order they weigh.
 */
const LINE_STEPS: ReadonlyArray<readonly [string, string]> = [
  ["border.subtle", "border.muted"],
  ["border.muted", "border"],
  ["border", "border.emphasized"],
];

/**
 * Lists the steps of one palette a reader tells apart: the three quiet fills, the solid and its
 * hover, and the line and its hover.
 */
const PALETTE_STEPS: ReadonlyArray<readonly [string, string]> = [
  ["subtle", "muted"],
  ["muted", "emphasized"],
  ["solid", "solid.hover"],
  ["border", "border.hover"],
];

/**
 * Lists the surfaces a palette's resting fill has to be told from, so a subtle control is seen
 * on the page, on a card and on a menu.
 */
const FILL_SURFACES = ["bg", "bg.panel", "bg.popover"];

/**
 * Reports each pair of steps closer in lightness than the minimum, in either mode, or one that
 * could not be measured.
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
 * Reports two surfaces a reader cannot tell apart.
 */
export function surfaces(
  theme: Theme,
  options: Resolving,
  thresholds: Thresholds,
): readonly string[] {
  return apart(theme, SURFACE_STEPS, options, thresholds.distinct);
}

/**
 * Reports two consecutive inks a reader cannot tell apart.
 */
export function inks(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  return apart(theme, INK_STEPS, options, thresholds.distinct);
}

/**
 * Reports two consecutive lines a reader cannot tell apart.
 */
export function lines(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  return apart(theme, LINE_STEPS, options, thresholds.distinct);
}

/**
 * Reports two steps of a palette a reader cannot tell apart: a fill from the next, a solid from
 * its hover, a line from its hover, or the resting fill from a surface it sits on.
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
