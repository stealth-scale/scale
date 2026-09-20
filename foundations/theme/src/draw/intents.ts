/**
 * Draws the eight intents a recipe names: the brand's three, the neutral, and the four statuses.
 *
 * @remarks
 *   Every intent is drawn from a color over the theme's pages. A brand intent left unstated takes
 *   the canonical purple, or the primary palette by reference for the accent. A status left
 *   unstated takes the canonical hue of its name, so it keeps its meaning on any page, at the
 *   chroma of the brand's most saturated intent, so a muted brand's statuses do not shout over
 *   it. The neutral is drawn from the ink, and its line, ring and ink point at the families, so a
 *   neutral outline button and an input share one edge. The statuses are drawn in turn, and one
 *   that lands on a solid already drawn, or near one of its own hue as a red brand's error does,
 *   is moved in lightness until it clears, so a destructive action and the primary action are
 *   never one button and an error and a warning are never one badge.
 */

import {
  type Hue,
  type HuePalette,
  type Palette,
  type SemanticPalette,
  type Status,
  STATUSES,
} from "#contract.ts";
import { atChroma, distanceOf, lightened, lightnessOf, polar, referenced } from "#draw/color.ts";
import { type DrawOptions, type Inked, isDark, type Side } from "#draw/ladder.ts";
import { canonical, drawn, type Solid } from "#draw/palette.ts";
import { recordOf } from "#record.ts";

/**
 * Lists the two sides a solid is drawn on.
 */
const SIDES: readonly Side[] = ["dark", "light"];

/**
 * Describes the colors a theme states for its intents.
 */
export interface Intents {
  /**
   * The attention color: links, focus rings, selection, the active indicator. The primary
   * palette unless stated.
   */
  accent?: Solid | undefined;

  /**
   * The error status. The canonical red unless stated.
   */
  error?: Solid | undefined;

  /**
   * The information status. The canonical cyan unless stated.
   */
  info?: Solid | undefined;

  /**
   * The grey controls. The ink unless stated.
   */
  neutral?: Solid | undefined;

  /**
   * The brand's action color.
   */
  primary: Solid;

  /**
   * The brand's second color. The canonical purple unless stated.
   */
  secondary?: Solid | undefined;

  /**
   * The success status. The canonical green unless stated.
   */
  success?: Solid | undefined;

  /**
   * The warning status. The canonical orange unless stated.
   */
  warning?: Solid | undefined;
}

/**
 * Fixes the canonical hue of each status, in degrees around the wheel, which the gate holds a
 * status solid to.
 */
export const STATUS_HUES: Readonly<Record<Status, number>> = {
  error: 25,
  info: 220,
  success: 150,
  warning: 60,
};

/**
 * Maps each status to the foundation's hue its canonical color is read from.
 */
const CANONICAL: Readonly<Record<Status, Hue>> = {
  error: "red",
  info: "cyan",
  success: "green",
  warning: "orange",
};

/**
 * Fixes the hue the secondary intent is drawn from where a theme states none.
 */
const SECONDARY: Hue = "purple";

/**
 * Fixes the distance in OKLab a status solid keeps from the primary's and the neutral's, which is
 * the distance the gate holds it to.
 */
const APART = 0.05;

/**
 * Fixes the distance in OKLab a status solid keeps from a brand solid of its own hue: more than
 * the gate asks, because a red the gate can tell from a red is not yet a button a reader can.
 */
const APART_IN_HUE = 0.12;

/**
 * Fixes the degrees within which two solids are of one hue.
 */
const SAME_HUE = 30;

/**
 * Lists how far a status solid tries moving in lightness, from the smallest move that might clear
 * to the largest one a page has room for.
 */
const NUDGES: readonly number[] = [0.1, 0.15, 0.2, 0.25, 0.3];

/**
 * Fixes the share of its chroma a status solid keeps when it moves, so it is read from its color
 * wherever it lands.
 *
 * @remarks
 *   A move towards white or black leaves the gamut and the color is put back inside it with its
 *   chroma cut, so a red moved far enough to clear a red brand arrives as a pink and then as a
 *   grey. A status that cannot clear without bleaching stays where it reads, and the gate reports
 *   what is left.
 */
const KEPT_CHROMA = 0.5;

/**
 * Fixes the chroma an unstated status keeps at least, so a grey brand's statuses still read as
 * colors.
 */
const STATUS_CHROMA = 0.1;

/**
 * Reads the options one intent is drawn with: the theme's own, with the list form of `keep`
 * resolved to whether this intent is among the solids the theme holds as stated.
 */
function keeping(options: DrawOptions, palette: Palette): DrawOptions {
  const { keep } = options;

  return {
    ...options,
    keep: keep === true || (keep !== false && keep?.includes(palette) === true),
  };
}

/**
 * Points the neutral palette's ink, line and ring at the families, so a neutral outline button
 * and an input share one edge.
 */
function neutralOf(palette: HuePalette): SemanticPalette {
  return {
    ...palette,
    border: { DEFAULT: referenced("border.emphasized"), hover: referenced("fg.subtle") },
    fg: referenced("fg"),
    focusRing: referenced("border.focus"),
  };
}

/**
 * Points every role of the accent at the primary palette.
 */
function accentOf(): SemanticPalette {
  return {
    border: { DEFAULT: referenced("primary.border"), hover: referenced("primary.border.hover") },
    contrast: referenced("primary.contrast"),
    emphasized: referenced("primary.emphasized"),
    fg: referenced("primary.fg"),
    focusRing: referenced("primary.focusRing"),
    muted: referenced("primary.muted"),
    solid: { DEFAULT: referenced("primary.solid"), hover: referenced("primary.solid.hover") },
    subtle: referenced("primary.subtle"),
  };
}

/**
 * Reads the solid a palette was drawn with on one side.
 */
function solidOf(palette: HuePalette, side: Side): string {
  return palette.solid.DEFAULT.value[side === "dark" ? "_dark" : "base"];
}

/**
 * Draws the color an unstated status is drawn from: the canonical color of its hue, with its
 * chroma taken down to the brand's where the brand is quieter, and no lower than a status has
 * to be to read as a color.
 *
 * @param hue - The foundation's hue the status is read from.
 * @param brands - The palettes whose most saturated solid on each side the status follows.
 */
function toned(hue: Hue, brands: readonly HuePalette[]): Solid {
  const color = canonical(hue);

  return recordOf(SIDES, (side) => {
    const own = polar(color[side]).chroma;
    const brand = Math.max(...brands.map((palette) => polar(solidOf(palette, side)).chroma));

    return atChroma(color[side], Math.min(own, Math.max(brand, STATUS_CHROMA)));
  });
}

/**
 * Measures how many degrees apart two colors' hues are, the short way round the wheel.
 */
function huesApart(one: string, other: string): number {
  return Math.abs(((polar(one).hue - polar(other).hue + 540) % 360) - 180);
}

/**
 * Reports whether a palette's solid on one side lands on a solid already drawn, or near one of
 * its own hue.
 */
function crowded(palette: HuePalette, taken: readonly HuePalette[], side: Side): boolean {
  const solid = solidOf(palette, side);

  return taken.some((other) => {
    const distance = distanceOf(solid, solidOf(other, side));

    return (
      distance < APART ||
      (distance < APART_IN_HUE && huesApart(solid, solidOf(other, side)) < SAME_HUE)
    );
  });
}

/**
 * Draws a status from its color, moved in lightness on any side where it lands on a solid already
 * drawn or near one of its own hue, so a status and a brand action are never one color, a red
 * brand's error is not a red a shade off, and two statuses are never one color either.
 *
 * @remarks
 *   A solid the theme asked to keep is not moved at all, here or anywhere else, and the gate
 *   reports what it collides with. Otherwise the moves are tried from the smallest, away from the
 *   page first, because a solid moved away from the page keeps standing on it. The first move that
 *   clears everything already drawn is kept. Where a page leaves room for none of them, which a
 *   page of middle lightness under a pale ink can do, the move that stands furthest from
 *   everything is kept and the gate reports what is left.
 */
function statusOf(
  color: Solid,
  modes: Inked,
  taken: readonly HuePalette[],
  options: DrawOptions,
): HuePalette {
  let palette = drawn(color, modes, options);

  if (options.keep === true) return palette;

  /**
   * Draws the palette again with its solid on one side moved a step in lightness.
   */
  const nudged = (side: Side, step: number): HuePalette => {
    const solid = solidOf(palette, side);

    return drawn(
      {
        ...recordOf(SIDES, (each) => solidOf(palette, each)),
        [side]: lightened(solid, lightnessOf(solid) + step),
      },
      modes,
      options,
    );
  };

  for (const side of SIDES) {
    if (!crowded(palette, taken, side)) continue;

    const away = isDark(modes[side]) ? 1 : -1;
    const floor = polar(solidOf(palette, side)).chroma * KEPT_CHROMA;
    const moves = NUDGES.flatMap((step) => [
      nudged(side, step * away),
      nudged(side, -step * away),
    ]).filter((move) => polar(solidOf(move, side)).chroma >= floor);

    /**
     * Reads the largest move the search kept, which stands furthest from what is already drawn
     * because the steps are tried from the smallest. The palette stays where it is where every
     * move bleached it past the chroma a status is read by.
     */
    const largest = moves.reduce((furthest, move) => move, palette);

    palette = moves.find((move) => !crowded(move, taken, side)) ?? largest;
  }

  return palette;
}

/**
 * Draws the eight intents from the colors a theme states, over the page and the ink of each mode.
 *
 * @param modes - The page and the ink of each mode.
 * @param spec - The color of each intent the theme states.
 * @param options - The ratios the theme restates and whether a solid is kept as stated.
 */
export function intents(
  modes: Inked,
  spec: Intents,
  options: DrawOptions = {},
): Record<Palette, SemanticPalette> {
  const primary = drawn(spec.primary, modes, keeping(options, "primary"));
  const accent =
    spec.accent === undefined ? undefined : drawn(spec.accent, modes, keeping(options, "accent"));
  const neutral = drawn(
    spec.neutral ?? { dark: modes.dark.ink, light: modes.light.ink },
    modes,
    keeping(options, "neutral"),
  );
  const brands = accent === undefined ? [primary] : [primary, accent];
  const taken: HuePalette[] = [primary, neutral];
  const statuses: Record<Status, HuePalette> = recordOf(STATUSES, (status) => {
    const palette = statusOf(
      spec[status] ?? toned(CANONICAL[status], brands),
      modes,
      taken,
      keeping(options, status),
    );

    taken.push(palette);

    return palette;
  });

  return {
    ...statuses,
    accent: accent ?? accentOf(),
    neutral: neutralOf(neutral),
    primary,
    secondary: drawn(spec.secondary ?? canonical(SECONDARY), modes, keeping(options, "secondary")),
  };
}
