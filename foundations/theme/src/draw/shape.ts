/**
 * Draws the shape of a theme: the three concentric corners from the roundest one, the three
 * stroke widths a recipe draws a line at, and the ring a focused control is marked with.
 *
 * @remarks
 *   A recipe reads `l1` to `l3` for its corners and `hairline`, `control` or `indicator` for its
 *   lines, so a theme that wants rounder cards or a heavier hand restates one value and every
 *   nested corner and every input, outline and bar follows. A theme that wants a corner off the
 *   concentric ladder states that corner outright. The ring is drawn by the compiler's focus
 *   utility from two properties the global styles fill, so a theme moves the ring by restating
 *   its width or the room it leaves round the control.
 */

import { type SemanticTokens } from "#pandacss.ts";
import { compact } from "#record.ts";

/**
 * Selects one of the corners a box is drawn with: the three a theme draws from one value, and the
 * one that rounds a box to its own edge.
 */
export type Corner = "full" | "l1" | "l2" | "l3";

/**
 * Lists the corners, from the tightest to the fully round.
 */
export const CORNERS: readonly Corner[] = ["l1", "l2", "l3", "full"];

/**
 * Selects one of the shapes a box that holds a picture is drawn in.
 */
export type Ratio = "golden" | "landscape" | "portrait" | "square" | "ultrawide" | "video" | "wide";

/**
 * Lists the shapes, from the squarest to the widest.
 */
export const ASPECT_RATIOS: readonly Ratio[] = [
  "square",
  "landscape",
  "portrait",
  "golden",
  "video",
  "wide",
  "ultrawide",
];

/**
 * Selects one of the three jobs a line is drawn for.
 */
export type Stroke = "control" | "hairline" | "indicator";

/**
 * Describes the radii a theme states.
 */
type Radii = NonNullable<SemanticTokens["radii"]>;

/**
 * Describes the stroke widths a theme states.
 */
type Strokes = NonNullable<SemanticTokens["borderWidths"]>;

/**
 * Describes the spacing the shape draws.
 */
type Spaced = NonNullable<SemanticTokens["spacing"]>;

/**
 * Describes what a theme states about the ring a focused control is marked with.
 */
export interface Ring {
  /**
   * The room the ring leaves between itself and the control. Two pixels unless stated.
   */
  offset?: string | undefined;

  /**
   * The width of the ring itself. Two pixels unless stated.
   */
  width?: string | undefined;
}

/**
 * Describes what a theme states about its shape.
 */
export interface Shape {
  /**
   * The width of a control's boundary: an input's edge, an outline button, a switch track. One
   * pixel unless stated.
   */
  control?: string | undefined;

  /**
   * The roundest corner, which a container is drawn with. Five eighths of a rem unless stated.
   */
  corner?: string | undefined;

  /**
   * The width of a separator, a card edge, a table rule or a divider. One pixel unless stated.
   */
  hairline?: string | undefined;

  /**
   * The width of an active bar: a tab indicator, a highlighted row's bar, a keycap's foot. Two
   * pixels unless stated.
   */
  indicator?: string | undefined;

  /**
   * The corner of an inner element, where the theme takes it off the concentric ladder. Half the
   * roundest corner unless stated.
   */
  l1?: string | undefined;

  /**
   * The corner of a control, where the theme takes it off the ladder. Three quarters of the
   * roundest corner unless stated.
   */
  l2?: string | undefined;

  /**
   * The corner of a container, where the theme states it apart from the roundest corner.
   */
  l3?: string | undefined;

  /**
   * The ring a focused control is marked with.
   */
  ring?: Ring | undefined;
}

/**
 * Describes the shape as drawn: the three categories a theme spreads into its semantic tokens.
 */
export interface Drawn {
  /**
   * The three stroke widths and the ring's.
   */
  borderWidths: Strokes;

  /**
   * The three concentric corners.
   */
  radii: Radii;

  /**
   * The room the ring leaves round a control.
   */
  spacing: Spaced;
}

/**
 * Places each corner as a share of the roundest, so a nested corner stays concentric with the one
 * around it however round the theme is.
 */
const SHARES: ReadonlyArray<readonly [name: "l1" | "l2" | "l3", share: number]> = [
  ["l1", 0.5],
  ["l2", 0.75],
  ["l3", 1],
];

/**
 * Fixes the corner, the three widths and the ring the foundation draws at, each width a reference
 * into the scale of widths.
 */
const DEFAULTS: Readonly<Record<"corner" | "offset" | "ring" | Stroke, string>> = {
  control: "{borderWidths.sm}",
  corner: "0.625rem",
  hairline: "{borderWidths.sm}",
  indicator: "{borderWidths.md}",
  offset: "{spacing.0.5}",
  ring: "{borderWidths.md}",
};

/**
 * Draws three corners from the roundest one, keyed `l1` to `l3`, with any corner the theme takes
 * off the ladder stated outright.
 *
 * @param largest - The radius of the outermost corner, as CSS writes it.
 * @param stated - The corners the theme states apart from the ladder.
 */
export function radii(largest = DEFAULTS.corner, stated: Shape = {}): Radii {
  return Object.fromEntries(
    SHARES.map(([name, share]) => [
      name,
      {
        value: stated[name] ?? (share === 1 ? largest : `calc(${largest} * ${String(share)})`),
      },
    ]),
  );
}

/**
 * Draws the three stroke widths and the ring's, each the foundation's unless stated.
 */
export function strokes(stated: Shape = {}): Strokes {
  return {
    control: { value: stated.control ?? DEFAULTS.control },
    hairline: { value: stated.hairline ?? DEFAULTS.hairline },
    indicator: { value: stated.indicator ?? DEFAULTS.indicator },
    ring: { value: stated.ring?.width ?? DEFAULTS.ring },
  };
}

/**
 * Draws the shape a theme states: the corners, the stroke widths and the ring's room.
 *
 * @param stated - The corners, the widths and the ring, each the foundation's unless stated.
 */
export function shape(stated: Shape = {}): Drawn {
  return {
    borderWidths: strokes(stated),
    radii: radii(stated.corner ?? DEFAULTS.corner, compact(stated)),
    spacing: { ring: { value: stated.ring?.offset ?? DEFAULTS.offset } },
  };
}
