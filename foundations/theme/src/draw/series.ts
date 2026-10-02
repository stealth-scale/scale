/**
 * Draws the eight colors a chart's series take in order: the theme's own colors first, then the
 * foundation's hues furthest from them.
 *
 * @remarks
 *   The first series of a chart take the brand's colors, so the chart matches its theme. The
 *   theme's colors are taken in the order a designer ranks them: the primary, the secondary, the
 *   accent, then the hues the theme states, or the list it states in their place. A grey is passed
 *   over, because series are told apart by hue, and so is a color within a distance of one already
 *   taken, as an accent drawn from the primary is. The rest are the foundation's hues, each the one
 *   furthest from every color taken, at no more chroma than the most saturated color taken and no
 *   less than an unstated status's, so the series of a quiet theme are as quiet as the theme and
 *   still differ by hue. Red and green are left to error and success. Every member is a palette's
 *   chart color: on a light page the lightest color that keeps the boundary ratio, on a dark page
 *   the solid.
 */

import { type Hue, type Moded, MODES, SERIES } from "#contract.ts";
import { atChroma, distanceOf, GREY_CHROMA, polar } from "#draw/color.ts";
import { type DrawOptions, type Inked } from "#draw/ladder.ts";
import { canonical, drawn, type Solid } from "#draw/palette.ts";
import { recordOf } from "#record.ts";

/**
 * Fixes the distance in OKLab a stated color keeps from every color taken before it, or it is
 * passed over.
 */
const APART = 0.08;

/**
 * Fixes the chroma a filling hue keeps at least, the chroma an unstated status keeps, so a quiet
 * theme's series still differ by hue.
 */
const FILL_CHROMA = 0.1;

/**
 * Lists the foundation's hues a series may take, in the order the first free one is taken: every
 * hue but the grey, the red and the green.
 */
const FILLS: readonly Hue[] = [
  "blue",
  "orange",
  "teal",
  "purple",
  "pink",
  "yellow",
  "cyan",
  "indigo",
];

/**
 * Describes the colors a theme states that its series are drawn from.
 */
export interface Sources {
  /**
   * The attention color, where the theme states one.
   */
  readonly accent?: Solid | undefined;

  /**
   * The hues the theme states, in the order it states them.
   */
  readonly hues?: Readonly<Partial<Record<Hue, Solid>>> | undefined;

  /**
   * The brand's action color.
   */
  readonly primary: Solid;

  /**
   * The brand's second color, where the theme states one.
   */
  readonly secondary?: Solid | undefined;

  /**
   * The colors a theme ranks for its series in place of its intents and hues.
   */
  readonly series?: readonly Solid[] | undefined;
}

/**
 * Lists the colors a theme ranks for its series: its stated list, else its intents and hues.
 */
function ranked(sources: Sources): readonly Solid[] {
  if (sources.series !== undefined) return sources.series;

  return [
    sources.primary,
    sources.secondary,
    sources.accent,
    ...Object.values(sources.hues ?? {}),
  ].filter((solid): solid is Solid => solid !== undefined);
}

/**
 * Measures the least distance in OKLab from a color to any color taken, in either mode.
 */
function nearest(color: Moded, taken: readonly Moded[]): number {
  return Math.min(
    Number.POSITIVE_INFINITY,
    ...taken.flatMap((each) =>
      MODES.map((mode) => distanceOf(color.value[mode], each.value[mode])),
    ),
  );
}

/**
 * Draws a foundation hue at no more than a chroma, on each side.
 */
function toned(hue: Hue, chroma: number): Solid {
  const { dark, light } = canonical(hue);

  return {
    dark: atChroma(dark, Math.min(polar(dark).chroma, chroma)),
    light: atChroma(light, Math.min(polar(light).chroma, chroma)),
  };
}

/**
 * Draws the series colors from the colors a theme states, over the page and the ink of each mode.
 *
 * @param sources - The theme's intents, hues and stated series.
 * @param modes - The page and the ink of each mode.
 * @param options - The ratios the theme restates.
 */
export function series(
  sources: Sources,
  modes: Inked,
  options: DrawOptions = {},
): Record<(typeof SERIES)[number], Moded> {
  const drawing: DrawOptions = { ...options, keep: options.keep === true };

  /**
   * Draws a color's chart role over the theme's pages.
   */
  const charted = (solid: Solid): Moded => drawn(solid, modes, drawing).chart;

  const taken: Moded[] = [];

  for (const color of ranked(sources).map((solid) => charted(solid))) {
    if (polar(color.value.base).chroma >= GREY_CHROMA && nearest(color, taken) >= APART) {
      taken.push(color);
    }
  }

  const chroma = Math.max(FILL_CHROMA, ...taken.map((each) => polar(each.value.base).chroma));
  let free = FILLS.map((hue) => charted(toned(hue, taken.length === 0 ? 1 : chroma)));

  while (taken.length < SERIES.length) {
    const furthest = free.reduce((best, each) =>
      nearest(each, taken) > nearest(best, taken) ? each : best,
    );

    taken.push(furthest);
    free = free.filter((each) => each !== furthest);
  }

  return recordOf(SERIES, (step) => {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the loop takes a color for every step
    return taken[SERIES.indexOf(step)] as Moded;
  });
}
