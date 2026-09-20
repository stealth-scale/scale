/**
 * Measures every pair of colors a page draws text, a line or a ring in, and reports the ones a
 * reader cannot use.
 *
 * @remarks
 *   The thresholds are WCAG 1.4.6 for text, 1.4.3 for a tertiary ink and a label, and 1.4.11 for
 *   a boundary or a focus indicator. The pairs are the ones the vocabulary draws: every ink on
 *   every surface, every palette's ink on the page and its fills, its label on its solid, its
 *   solid and its lines on the page and the panel, and its ring on every surface.
 */

import { contrast, type Mode, MODES, type Theme } from "@stealthscale/theme/authoring";

import { colorAt, palettesOf, type Resolving } from "#theme.ts";

/**
 * Fixes the ratio each class of pair is held to, and the distance each class of step is held
 * apart.
 */
export interface Thresholds {
  /**
   * The ratio a control's boundary, a palette's line and a solid have to clear against the
   * surface each sits on.
   */
  boundary: number;

  /**
   * The difference in OKLab lightness two steps have to keep, so a surface, a fill, an ink or a
   * line can be told from the one beside it.
   */
  distinct: number;

  /**
   * The ratio a focus ring has to clear against every surface.
   */
  focus: number;

  /**
   * The ratio the structural hairline has to clear against the page and the panel.
   */
  hairline: number;

  /**
   * The degrees a step of a ramp may drift from the ramp's median hue.
   */
  hue: number;

  /**
   * The degrees a status solid may sit from the canonical hue of its status.
   */
  identity: number;

  /**
   * The ratio the label on a solid has to clear.
   */
  label: number;

  /**
   * The distance in OKLab two status solids have to keep from each other, from the primary and
   * from the neutral.
   */
  status: number;

  /**
   * The ratio the tertiary ink has to clear against the surface it is set on.
   */
  tertiary: number;

  /**
   * The ratio text has to clear against the surface it is set on.
   */
  text: number;
}

/**
 * Fixes the thresholds WCAG sets, 7:1 for text at AAA, 4.5:1 for a tertiary ink and a label at
 * AA, and 3:1 for a boundary or a focus ring, the ratio the structural hairline is drawn to, and
 * the distances a theme keeps: a fiftieth of the lightness axis between steps, a twentieth of the
 * OKLab space between status solids, thirty degrees of hue between a status and its canonical
 * hue, and forty-five degrees of hue along a ramp, which is how far an orange or a yellow drifts
 * between its light end and its dark end.
 */
export const THRESHOLDS: Thresholds = {
  boundary: 3,
  distinct: 0.02,
  focus: 3,
  hairline: 1.45,
  hue: 45,
  identity: 30,
  label: 4.5,
  status: 0.05,
  tertiary: 4.5,
  text: 7,
};

/**
 * Lists the surfaces text and rings are drawn on.
 */
export const SURFACES = ["bg", "bg.subtle", "bg.muted", "bg.emphasized", "bg.panel", "bg.popover"];

/**
 * Lists the surfaces a control sits on, which its boundary has to stand from.
 */
const CONTROL_SURFACES = ["bg", "bg.panel", "bg.popover", "bg.subtle"];

/**
 * Lists the surfaces a hairline and a palette's solid and lines are drawn on.
 */
const RAISED_SURFACES = ["bg", "bg.panel"];

/**
 * Lists the inks a page is written in at the text ratio.
 */
const INKS = ["fg", "fg.muted", "fg.info", "fg.success", "fg.warning", "fg.error"];

/**
 * Lists the code inks a passage of code is set in, each of which is text a reader reads.
 *
 * @remarks
 *   A code block is drawn on the page, so these are measured there and on the panel a block may
 *   sit in. The comment is left out: it points at the muted ink, which is already measured.
 */
const CODE_INKS = [
  "code.attr",
  "code.deleted",
  "code.function",
  "code.inserted",
  "code.keyword",
  "code.number",
  "code.string",
  "code.tag",
  "code.type",
];

/**
 * Lists the surfaces a passage of code is set on.
 */
const CODE_SURFACES = ["bg", "bg.panel"];

/**
 * Lists the text pairs each palette draws at the text ratio: the ink on the page, the raised
 * surfaces and the palette's fills.
 */
const PALETTE_TEXT: ReadonlyArray<readonly [ink: string, fill: string]> = [
  ["fg", "bg"],
  ["fg", "bg.panel"],
  ["fg", "bg.popover"],
  ["fg", "subtle"],
  ["fg", "muted"],
  ["fg", "emphasized"],
];

/**
 * Lists the label pairs each palette draws: the ink on the solid and on its hover.
 */
const PALETTE_LABEL: ReadonlyArray<readonly [ink: string, fill: string]> = [
  ["contrast", "solid"],
  ["contrast", "solid.hover"],
];

/**
 * Lists the palette roles that have to stand out against the page and the panel.
 */
const PALETTE_BOUNDARY = ["solid", "border", "border.hover"];

/**
 * Describes one pair to measure: what is in front, what is behind, and the ratio it is held to.
 */
export interface Pair {
  /**
   * The token path behind.
   */
  back: string;

  /**
   * The token path in front.
   */
  front: string;

  /**
   * The ratio the pair has to clear.
   */
  minimum: number;
}

/**
 * Describes one pair as measured in one mode.
 */
export interface Measured extends Pair {
  /**
   * The mode the pair was measured in.
   */
  mode: Mode;

  /**
   * The ratio measured, or `NaN` where a color could not be resolved.
   */
  ratio: number;
}

/**
 * Measures every pair in both modes.
 */
export function measured(
  theme: Theme,
  pairs: readonly Pair[],
  options: Resolving,
): readonly Measured[] {
  return MODES.flatMap((mode) =>
    pairs.map((pair) => {
      const before = colorAt(theme, pair.front, mode, options);
      const behind = colorAt(theme, pair.back, mode, options);
      const ratio =
        before === undefined || behind === undefined ? Number.NaN : contrast(before, behind);

      return { ...pair, mode, ratio };
    }),
  );
}

/**
 * Reports each measured pair below its ratio, or one that could not be measured.
 */
function failing(theme: Theme, pairs: readonly Pair[], options: Resolving): readonly string[] {
  return measured(theme, pairs, options).flatMap(({ back, front, minimum, mode, ratio }) => {
    if (ratio >= minimum) return [];

    const reading = Number.isNaN(ratio) ? "cannot be measured" : `measures ${ratio.toFixed(2)}`;

    return [`${theme.name} ${front} on ${back} ${reading} in ${mode}, below ${String(minimum)}`];
  });
}

/**
 * Pairs each front with each surface.
 */
function onSurfaces(
  fronts: readonly string[],
  surfaces: readonly string[],
  minimum: number,
): readonly Pair[] {
  return fronts.flatMap((front) => surfaces.map((back) => ({ back, front, minimum })));
}

/**
 * Pairs each role of each palette with the fill or the surface it has to clear.
 *
 * @remarks
 *   A back that names a surface is read as it is, and any other back is a role of the same
 *   palette.
 */
function perPalette(
  theme: Theme,
  roles: ReadonlyArray<readonly [front: string, back: string]>,
  minimum: number,
): readonly Pair[] {
  return palettesOf(theme).flatMap((palette) =>
    roles.map(([front, back]) => ({
      back: back.startsWith("bg") ? back : `${palette}.${back}`,
      front: `${palette}.${front}`,
      minimum,
    })),
  );
}

/**
 * Lists every text pair: the inks on the surfaces at the text ratio, the tertiary ink on the
 * surfaces at its own, each palette's ink on the page and its fills, and each palette's label on
 * its solid.
 */
export function textPairs(theme: Theme, thresholds: Thresholds): readonly Pair[] {
  return [
    ...onSurfaces(INKS, SURFACES, thresholds.text),
    ...onSurfaces(["fg.subtle"], SURFACES, thresholds.tertiary),
    ...onSurfaces(CODE_INKS, CODE_SURFACES, thresholds.text),
    ...perPalette(theme, PALETTE_TEXT, thresholds.text),
    ...perPalette(theme, PALETTE_LABEL, thresholds.label),
  ];
}

/**
 * Lists every boundary pair: the control's boundary on the surfaces a control sits on, the
 * hairline on the page and the panel at its own ratio, and each palette's solid and lines on the
 * page and the panel.
 */
export function boundaryPairs(theme: Theme, thresholds: Thresholds): readonly Pair[] {
  return [
    ...onSurfaces(["border.emphasized"], CONTROL_SURFACES, thresholds.boundary),
    ...onSurfaces(["border"], RAISED_SURFACES, thresholds.hairline),
    ...perPalette(
      theme,
      PALETTE_BOUNDARY.flatMap((role) => RAISED_SURFACES.map((back) => [role, back] as const)),
      thresholds.boundary,
    ),
  ];
}

/**
 * Lists every focus pair: each palette's ring on every surface.
 */
export function focusPairs(theme: Theme, thresholds: Thresholds): readonly Pair[] {
  return onSurfaces(
    palettesOf(theme).map((palette) => `${palette}.focusRing`),
    SURFACES,
    thresholds.focus,
  );
}

/**
 * Reports every text, tertiary or label pair below its ratio.
 */
export function text(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  return failing(theme, textPairs(theme, thresholds), options);
}

/**
 * Reports every boundary or hairline pair below its ratio.
 */
export function boundary(
  theme: Theme,
  options: Resolving,
  thresholds: Thresholds,
): readonly string[] {
  return failing(theme, boundaryPairs(theme, thresholds), options);
}

/**
 * Reports every palette's focus ring below the focus ratio on any surface.
 */
export function focus(theme: Theme, options: Resolving, thresholds: Thresholds): readonly string[] {
  return failing(theme, focusPairs(theme, thresholds), options);
}
