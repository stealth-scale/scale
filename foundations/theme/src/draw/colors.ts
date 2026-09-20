/**
 * Draws the three families of a theme from the page and the ink of each mode: the surfaces, the
 * inks and the lines.
 *
 * @remarks
 *   The page and the ink are taken as stated. Every surface is the page moved a fixed distance in
 *   its own tint along the ladders. Every faded ink is the ink faded towards the page until it
 *   still reads at its ratio on the worst surface. Every line is the page raised towards the ink
 *   until it reads at its ratio. The families hold no color the theme did not state or tint.
 */

import { type Families, type Filled, type Moded, type Status, STATUSES } from "#contract.ts";
import { referenced, stated } from "#draw/color.ts";
import {
  apart,
  type DrawOptions,
  faded,
  HAIRLINES,
  type Inked,
  type Ladder,
  ladderOf,
  raised,
  type Ratios,
  ratiosOf,
  type Side,
} from "#draw/ladder.ts";
import { recordOf } from "#record.ts";

/**
 * Fixes the overlay behind a dialog on each side: black, deeper after dark.
 */
const BACKDROP: Readonly<Record<Side, string>> = {
  dark: "oklch(0% 0 0 / 0.64)",
  light: "oklch(0% 0 0 / 0.44)",
};

/**
 * Fixes the least lightness two consecutive lines keep between them.
 */
const STEP = 0.025;

/**
 * Describes the surfaces, inks and lines of one side, before the two sides are joined.
 */
interface Drawn {
  /**
   * The faded inks.
   */
  inks: Record<"muted" | "subtle", string>;

  /**
   * The placed surfaces.
   */
  ladder: Ladder;

  /**
   * The lines, from the lightest hairline to the control's boundary.
   */
  lines: Record<"DEFAULT" | "emphasized" | "muted" | "subtle", string>;
}

/**
 * Writes the status members of a family, each a reference into a status palette's role.
 */
function statuses(role: string): Record<Status, Filled> {
  return recordOf(STATUSES, (status) => referenced(`${status}.${role}`));
}

/**
 * Draws one side: the ladder, the two faded inks against every surface, and the four lines
 * against the surfaces each is drawn on.
 *
 * @remarks
 *   A hairline is measured on the page, the panel and the popover, which is where a separator is
 *   drawn. A control's boundary is measured on those and on the shallowest well as well, because a
 *   field sits in a striped row and a read-only field sits on the well itself. Each line is kept a
 *   step on from the one before it, because two hairlines drawn to ratios a tenth apart land
 *   within a hundredth of each other on a dark page. The tertiary ink is kept a step on from the
 *   control's boundary, because a theme drawing both to one ratio lands them on one color, and a
 *   hovered edge that darkens to the tertiary ink would then not move.
 */
function drawnSide(ladder: Ladder, ratios: Ratios): Drawn {
  const { fills, ink, page, panel, popover, wells } = ladder;
  const every = [page, panel, popover, ...wells, ...fills];
  const raisedOn = [page, panel, popover];
  const subtle = raised(page, ink, raisedOn, HAIRLINES.subtle);
  const muted = apart(subtle, raised(page, ink, raisedOn, HAIRLINES.muted), ink, STEP);
  const line = apart(muted, raised(page, ink, raisedOn, ratios.hairline), ink, STEP);
  const emphasized = apart(
    line,
    raised(page, ink, [...raisedOn, wells[0]], ratios.boundary),
    ink,
    STEP,
  );

  return {
    inks: {
      muted: faded(ink, page, every, ratios.text),
      subtle: apart(emphasized, faded(ink, page, every, ratios.tertiary), ink, STEP),
    },
    ladder,
    lines: { DEFAULT: line, emphasized, muted, subtle },
  };
}

/**
 * Joins one value from each side into the token the compiler reads.
 */
function joined(sides: Record<Side, Drawn>, pick: (side: Drawn) => string): Moded {
  return stated(pick(sides.light), pick(sides.dark));
}

/**
 * Draws the surfaces: the page, the raised and floating surfaces, the three wells, the inverse
 * from the other side, and the backdrop.
 */
function surfaces(sides: Record<Side, Drawn>): Families["bg"] {
  return {
    backdrop: stated(BACKDROP.light, BACKDROP.dark),
    DEFAULT: joined(sides, ({ ladder }) => ladder.page),
    emphasized: joined(sides, ({ ladder }) => ladder.wells[2]),
    inverted: stated(sides.dark.ladder.page, sides.light.ladder.page),
    muted: joined(sides, ({ ladder }) => ladder.wells[1]),
    panel: joined(sides, ({ ladder }) => ladder.panel),
    popover: joined(sides, ({ ladder }) => ladder.popover),
    subtle: joined(sides, ({ ladder }) => ladder.wells[0]),
    ...statuses("subtle"),
  };
}

/**
 * Draws the inks: the ink itself, the two faded ones, the inverse from the other side, and the
 * link ink from the accent.
 */
function inks(sides: Record<Side, Drawn>): Families["fg"] {
  return {
    DEFAULT: joined(sides, ({ ladder }) => ladder.ink),
    inverted: stated(sides.dark.ladder.ink, sides.light.ladder.ink),
    link: referenced("accent.fg"),
    muted: joined(sides, (side) => side.inks.muted),
    subtle: joined(sides, (side) => side.inks.subtle),
    ...statuses("fg"),
  };
}

/**
 * Draws the lines: the three hairlines, the control's boundary, the inverse from the other side,
 * and the focus line from the accent.
 */
function lines(sides: Record<Side, Drawn>): Families["border"] {
  return {
    DEFAULT: joined(sides, (side) => side.lines.DEFAULT),
    emphasized: joined(sides, (side) => side.lines.emphasized),
    focus: referenced("accent.focusRing"),
    inverted: stated(sides.dark.lines.DEFAULT, sides.light.lines.DEFAULT),
    muted: joined(sides, (side) => side.lines.muted),
    subtle: joined(sides, (side) => side.lines.subtle),
    ...statuses("border"),
  };
}

/**
 * Draws the three families from the page and the ink of each mode.
 *
 * @param modes - The page and the ink of each mode, and a panel where the theme states one.
 * @param options - The ratios the theme restates, where it restates any.
 */
export function inked(modes: Inked, options: DrawOptions = {}): Families {
  const ratios = ratiosOf(options);
  const sides: Record<Side, Drawn> = {
    dark: drawnSide(ladderOf(modes.dark, options), ratios),
    light: drawnSide(ladderOf(modes.light, options), ratios),
  };

  return { bg: surfaces(sides), border: lines(sides), fg: inks(sides) };
}
