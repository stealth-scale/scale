/**
 * Draws one palette of ten roles from one color and the page and the ink of each mode, and the
 * eleven hue palettes an application names a hue of.
 *
 * @remarks
 *   The solid is the color as stated. Where it fails to stand from the page or to carry a label,
 *   its lightness moves, hue and chroma kept, and a theme that wants it untouched says so. The
 *   quiet fills sit at the fill ladder's lightness tinted towards the solid, so every palette's
 *   fills share one lightness and differ by hue alone. The ink, the line and the ring are the
 *   solid raised towards the ink until each reads at its ratio on the worst surface it is drawn
 *   on.
 */

import { type Hue, type HuePalette, HUES, type Moded, type Role } from "#contract.ts";
import { lightened, lightnessOf, mixed, stated } from "#draw/color.ts";
import { contrast } from "#draw/contrast.ts";
import {
  type DrawOptions,
  type Inked,
  type Ladder,
  ladderOf,
  raised,
  type Ratios,
  ratiosOf,
  type Side,
  type Written,
} from "#draw/ladder.ts";
import { RAMPS, stepOf } from "#draw/ramps.ts";
import { recordOf } from "#record.ts";

/**
 * Describes the color a palette's solid is drawn in: one color for both modes, or one per mode.
 */
export type Solid = Readonly<Record<Side, string>> | string;

/**
 * Fixes how far each quiet fill is tinted from the ladder's step towards the solid.
 */
const TINTS: readonly [number, number, number] = [0.18, 0.28, 0.4];

/**
 * Fixes how far a hovered solid and a hovered line move in lightness.
 */
const HOVER = 0.06;

/**
 * Fixes how many steps a lightness search takes between a color and a bound before it refines the
 * one it stopped at.
 */
const STEPS_TO_BOUND = 64;

/**
 * Fixes how many halvings refine the step a lightness search stopped at.
 */
const HALVINGS = 8;

/**
 * Fixes the step of the foundation's ramp a canonical color is read at on each side.
 */
const STEPS: Readonly<Record<Side, number>> = { dark: 400, light: 600 };

/**
 * Fixes the two colors a label falls back to where neither the theme's ink nor its page carries
 * it on a solid.
 */
const BLACK = "#000000";

/**
 * Fixes the lighter of the two labels a solid falls back to.
 */
const WHITE = "#ffffff";

/**
 * Lists the hues whose light-mode solid is read a step lighter.
 *
 * @remarks
 *   An orange or a yellow at the step a blue is read at is a brown, because the eye reads a warm
 *   hue at that lightness as earth rather than as the hue. A step lighter it reads as amber.
 */
const WARM: ReadonlySet<Hue> = new Set<Hue>(["orange", "yellow"]);

/**
 * Reads the color of one side out of a solid stated for both or for each.
 */
export function sideOf(solid: Solid, side: Side): string {
  return typeof solid === "string" ? solid : solid[side];
}

/**
 * Reads the foundation's color for a hue on each side: its ramp at the step the foundation places
 * a solid on.
 */
export function canonical(hue: Hue): Readonly<Record<Side, string>> {
  const [angle, chroma] = RAMPS[hue];
  const light = WARM.has(hue) ? STEPS.light - 100 : STEPS.light;

  return { dark: stepOf(angle, chroma, STEPS.dark), light: stepOf(angle, chroma, light) };
}

/**
 * Picks what a solid's label is inked in: the ink or the page of its own side where either
 * carries the label, and otherwise black or white.
 *
 * @remarks
 *   A theme's ink and page are the two colors already on the screen, so a label drawn from one of
 *   them belongs to the theme. Where the solid is a mid-tone neither can read on, the label
 *   leaves the palette rather than the solid moving: a brand's action color survives and the
 *   words on it stay legible. Measured on Dusk's coral, whose navy ink carries a label at 3.01:1
 *   and whose black carries it at 6.46:1. Black and white bracket every color there is, so the
 *   better of the two is never worse than the ink or the page, and the worse of the two still
 *   clears 4.58:1 on the one color where they meet.
 * @param color - The solid the label is drawn on.
 * @param side - The page and the ink of the side the solid was drawn for.
 * @param label - The ratio the label has to clear.
 */
function over(color: string, side: Written, label: number): string {
  const owned = contrast(side.ink, color) >= contrast(side.page, color) ? side.ink : side.page;

  if (contrast(owned, color) >= label) return owned;

  return contrast(BLACK, color) >= contrast(WHITE, color) ? BLACK : WHITE;
}

/**
 * Picks the color a hovered solid moves towards, which is whichever end of the side is furthest
 * from the label it carries.
 */
function away(label: string, side: Written): string {
  return [side.page, BLACK, WHITE].reduce(
    (furthest, end) => (contrast(end, label) > contrast(furthest, label) ? end : furthest),
    side.ink,
  );
}

/**
 * Moves a color in lightness towards a bound only as far as a predicate needs: to the first of
 * the steps between the two at which it holds, refined by halving, or to nothing where it holds
 * at none of them.
 *
 * @remarks
 *   Stepped rather than halved from the bound, because a label can hold on a window between the
 *   color and the bound and fail at the bound itself: a solid moved towards the page reads with
 *   the ink on it for a while, and then stops standing from the page.
 */
function movedUntil(
  color: string,
  bound: string,
  holds: (candidate: string) => boolean,
): string | undefined {
  const start = lightnessOf(color);
  const end = lightnessOf(bound);

  /**
   * Places the color a share of the way to the bound.
   */
  const at = (share: number): string => lightened(color, start + (end - start) * share);

  for (let step = 1; step <= STEPS_TO_BOUND; step += 1) {
    if (!holds(at(step / STEPS_TO_BOUND))) continue;

    let failing = (step - 1) / STEPS_TO_BOUND;
    let holding = step / STEPS_TO_BOUND;

    for (let round = 0; round < HALVINGS; round += 1) {
      const middle = (failing + holding) / 2;

      if (holds(at(middle))) holding = middle;
      else failing = middle;
    }

    return at(holding);
  }

  return undefined;
}

/**
 * Moves a solid towards the ink until it stands from the page and the panel.
 *
 * @remarks
 *   Standing is the only reason a solid moves. Its label is settled afterwards and separately: a
 *   label falls back to black or white, and the worse of those two clears 4.58:1 on any color
 *   there is, so no brand color has to give up its lightness to carry one. A theme that asks more
 *   of its labels than that hears it from the gate rather than finding its brand quietly redrawn.
 */
function settled(solid: string, side: Written, ladder: Ladder, ratios: Ratios): string {
  /**
   * Reports whether a candidate stands from the page and the panel at the boundary ratio.
   */
  const standing = (candidate: string): boolean =>
    contrast(candidate, ladder.page) >= ratios.boundary &&
    contrast(candidate, ladder.panel) >= ratios.boundary;

  if (standing(solid)) return solid;

  return movedUntil(solid, side.ink, standing) ?? solid;
}

/**
 * Draws one quiet fill: the ladder's step tinted towards the solid, then put back at the ladder's
 * lightness.
 */
function tinted(step: string, solid: string, share: number): string {
  return lightened(mixed(step, solid, share), lightnessOf(step));
}

/**
 * Moves a color a step in lightness towards another, or the other way where the display has no
 * room in that direction.
 *
 * @remarks
 *   A hovered solid moves away from its label, so the label reads better under the pointer, and
 *   a hovered line moves towards the ink. A solid at white or black, which the neutral's is after
 *   dark, has nowhere to go that way and moves the other way instead. The step is a distance in
 *   lightness rather than a share of the way, because a share of a short way is a move nobody
 *   sees.
 */
function hovered(color: string, towards: string): string {
  const from = lightnessOf(color);
  const direction = lightnessOf(towards) >= from ? 1 : -1;
  const target = from + direction * HOVER;

  return lightened(color, target >= 0 && target <= 1 ? target : from - direction * HOVER);
}

/**
 * Draws the ten roles of one side from the solid, the page and the ink of that side.
 *
 * @remarks
 *   The line and the ring are measured on every surface a control sits on, the wells included,
 *   because a ring has to be seen wherever focus lands. The ink is measured on the page, the
 *   raised surfaces, the wells and the palette's own fills, which is where a palette's words are
 *   set.
 */
function sideRoles(color: string, side: Written, options: DrawOptions): Record<Role, string> {
  const ratios = ratiosOf(options);
  const ladder = ladderOf(side, options);
  const solid = options.keep === true ? color : settled(color, side, ladder, ratios);
  const label = over(solid, side, ratios.label);
  const unlabelled = away(label, side);
  const fills: [string, string, string] = [
    tinted(ladder.fills[0], solid, TINTS[0]),
    tinted(ladder.fills[1], solid, TINTS[1]),
    tinted(ladder.fills[2], solid, TINTS[2]),
  ];
  const surfaces = [ladder.page, ladder.panel, ladder.popover, ...ladder.wells];
  const line = raised(solid, side.ink, surfaces, ratios.boundary);

  return {
    border: line,
    "border.hover": hovered(line, side.ink),
    contrast: label,
    emphasized: fills[2],
    fg: raised(solid, side.ink, [...surfaces, ...fills], ratios.text),
    focusRing: line,
    muted: fills[1],
    solid,
    "solid.hover": hovered(solid, unlabelled),
    subtle: fills[0],
  };
}

/**
 * Draws a palette from one color and the page and the ink of each mode.
 *
 * @param solid - The color the palette's solid is drawn in, for both modes or for each.
 * @param modes - The page and the ink of each mode.
 * @param options - The ratios the theme restates and whether a solid is kept as stated.
 */
export function drawn(solid: Solid, modes: Inked, options: DrawOptions = {}): HuePalette {
  const light = sideRoles(sideOf(solid, "light"), modes.light, options);
  const dark = sideRoles(sideOf(solid, "dark"), modes.dark, options);

  /**
   * Joins one role's two sides into the value the compiler reads.
   */
  const role = (name: Role): Moded => stated(light[name], dark[name]);

  return {
    border: { DEFAULT: role("border"), hover: role("border.hover") },
    contrast: role("contrast"),
    emphasized: role("emphasized"),
    fg: role("fg"),
    focusRing: role("focusRing"),
    muted: role("muted"),
    solid: { DEFAULT: role("solid"), hover: role("solid.hover") },
    subtle: role("subtle"),
  };
}

/**
 * Draws every hue palette: each hue the theme states from its color, the grey from the ink, and
 * every other from the foundation's hue over the theme's pages.
 *
 * @param modes - The page and the ink of each mode.
 * @param solids - The color each stated hue is drawn in.
 * @param options - The ratios the theme restates and whether a solid is kept as stated.
 */
export function hues(
  modes: Inked,
  solids: Readonly<Partial<Record<Hue, Solid>>> = {},
  options: DrawOptions = {},
): Record<Hue, HuePalette> {
  const ink: Solid = { dark: modes.dark.ink, light: modes.light.ink };

  return recordOf(HUES, (hue) =>
    drawn(solids[hue] ?? (hue === "gray" ? ink : canonical(hue)), modes, options),
  );
}
