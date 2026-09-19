/**
 * Draws a hue palette from one color and the page and the ink of each mode: the solid is the
 * color, every quiet fill is the page tinted towards it, and the ink, the line and the ring are
 * the color pushed towards the mode's ink until each stands far enough from the page.
 *
 * @remarks
 *   The foundation places each role on a step of a ramp, which assumes a page near white and a
 *   page near black. A theme drawn from a palette puts its dark page wherever the palette puts
 *   it, and a fill read from a ramp can land darker than the page and read as a stain. A fill
 *   tinted from the page stays on the page whatever the page is, and an ink pushed a fixed
 *   distance from the page reads on it whatever the solid is.
 */

import { type Hue, type HuePalette, HUES, type Moded, type Role } from "#authoring/contract.ts";
import { contrast } from "#authoring/contrast.ts";
import { RAMPS } from "#preset/tokens/colors.ts";
import { recordOf } from "#record.ts";
import { stepOf } from "#scales/color.ts";
import { type Inked, mixed, read, type Side, stated, type Written } from "#scales/inked.ts";

/**
 * Describes the color a palette's solid is drawn in: one color for both modes, or one per mode.
 */
export type Solid = Record<Side, string> | string;

/**
 * Describes one quiet fill: how far it is mixed from the page towards the solid, and how far from
 * the page it has to stand whatever the solid is.
 */
interface Fill {
  /**
   * The least distance from the page, along the OKLab lightness axis.
   */
  apart: number;

  /**
   * The share of the way from the page towards the solid.
   */
  share: number;
}

/**
 * Fixes the four quiet fills, each further from the page than the last.
 *
 * @remarks
 *   The share draws the tint, and the distance keeps the fills apart where a solid sits close to
 *   the page in lightness, which a dark brand color on a dark page does.
 */
const FILLS: Readonly<Record<"bg" | "emphasized" | "muted" | "subtle", Fill>> = {
  bg: { apart: 0.02, share: 0.08 },
  emphasized: { apart: 0.12, share: 0.4 },
  muted: { apart: 0.08, share: 0.28 },
  subtle: { apart: 0.04, share: 0.16 },
};

/**
 * Fixes how far from the page, along the OKLab lightness axis, a palette's ink has to stand,
 * which is what keeps the ink of a light solid readable on a light page.
 */
const INK_APART = 0.42;

/**
 * Fixes how far from the page a palette's line and ring have to stand.
 */
const LINE_APART = 0.25;

/**
 * Fixes how far the muted ink fades from the ink towards the page.
 */
const MUTED = 0.25;

/**
 * Fixes how far a hovered line is lifted towards whichever of the ink and the page reads better
 * on it.
 */
const HOVER = 0.15;

/**
 * Fixes how far a hovered solid is lifted towards the text on it.
 */
const LIFT = 0.12;

/**
 * Fixes the step of the foundation's ramp a palette the theme does not state is drawn from, in
 * each mode: the same steps the foundation places its solids on.
 */
const STEPS: Record<Side, number> = { dark: 400, light: 600 };

/**
 * Lists the hues whose light-mode solid is drawn a step lighter.
 *
 * @remarks
 *   An orange or a yellow at the step a blue is drawn at is a brown, because the eye reads a warm
 *   hue at that lightness as earth rather than as the hue. A step lighter it reads as amber.
 */
const WARM: ReadonlySet<Hue> = new Set<Hue>(["orange", "yellow"]);

/**
 * Picks the ink or the page of one side, whichever reads better on a color.
 */
function over(color: string, side: Written): string {
  return contrast(side.ink, color) >= contrast(side.page, color) ? side.ink : side.page;
}

/**
 * Finds the share of the way from one color towards another at which the mix stands a distance
 * from the page in lightness: none where the color already does, and all of it where the other
 * color does not either.
 */
function towards(from: string, to: string, page: string, distance: number): number {
  const start = read(from).l;
  const end = read(to).l;
  const sheet = read(page).l;

  if (Math.abs(start - sheet) >= distance) return 0;

  const target = sheet + (end >= sheet ? distance : -distance);

  return Math.min(Math.max((target - start) / (end - start), 0), 1);
}

/**
 * Pushes a color towards the ink until it stands a distance from the page.
 */
function apart(color: string, side: Written, distance: number): string {
  return mixed(color, side.ink, towards(color, side.ink, side.page, distance));
}

/**
 * Lifts a color a share of the way towards whichever of the ink and the page reads better on it.
 */
function lifted(color: string, side: Written, share: number): string {
  return mixed(color, over(color, side), share);
}

/**
 * Draws one quiet fill: the page tinted towards the solid, then pushed towards the ink where the
 * tint alone leaves it too close to the page.
 */
function filled(solid: string, side: Written, fill: Fill): string {
  return apart(mixed(side.page, solid, fill.share), side, fill.apart);
}

/**
 * Draws the twelve roles of one side from the solid, the page and the ink of that side.
 */
function sideRoles(solid: string, side: Written): Record<Role, string> {
  const ink = apart(solid, side, INK_APART);
  const line = apart(solid, side, LINE_APART);

  return {
    bg: filled(solid, side, FILLS.bg),
    border: line,
    "border.hover": lifted(line, side, HOVER),
    contrast: over(solid, side),
    emphasized: filled(solid, side, FILLS.emphasized),
    fg: ink,
    "fg.muted": mixed(ink, side.page, MUTED),
    focusRing: line,
    muted: filled(solid, side, FILLS.muted),
    solid,
    "solid.hover": lifted(solid, side, LIFT),
    subtle: filled(solid, side, FILLS.subtle),
  };
}

/**
 * Draws a hue palette from one color and the page and the ink of each mode.
 *
 * @param solid - The color the palette's solid is drawn in, for both modes or for each.
 * @param modes - The page and the ink of each mode.
 */
export function drawn(solid: Solid, modes: Inked): HuePalette {
  const colors = typeof solid === "string" ? { dark: solid, light: solid } : solid;
  const light = sideRoles(colors.light, modes.light);
  const dark = sideRoles(colors.dark, modes.dark);

  /**
   * Joins one role's two sides into the value the compiler reads.
   */
  const role = (name: Role): Moded => stated(light[name], dark[name]);

  return {
    bg: role("bg"),
    border: { DEFAULT: role("border"), hover: role("border.hover") },
    contrast: role("contrast"),
    emphasized: role("emphasized"),
    fg: { DEFAULT: role("fg"), muted: role("fg.muted") },
    focusRing: role("focusRing"),
    muted: role("muted"),
    solid: { DEFAULT: role("solid"), hover: role("solid.hover") },
    subtle: role("subtle"),
  };
}

/**
 * Picks the color a palette the theme does not state is drawn from: the ink for the grey, and
 * the foundation's hue at its solid steps for every other.
 */
function foundationOf(hue: Hue, modes: Inked): Record<Side, string> {
  if (hue === "gray") return { dark: modes.dark.ink, light: modes.light.ink };

  const [angle, chroma] = RAMPS[hue];
  const light = WARM.has(hue) ? STEPS.light - 100 : STEPS.light;

  return { dark: stepOf(angle, chroma, STEPS.dark), light: stepOf(angle, chroma, light) };
}

/**
 * Draws every hue palette: each hue the theme states from its color, the grey from the ink, and
 * every other from the foundation's hue at the steps the foundation places its solids on.
 *
 * @param modes - The page and the ink of each mode.
 * @param solids - The color each stated hue is drawn in.
 */
export function hues(
  modes: Inked,
  solids: Readonly<Partial<Record<Hue, Solid>>> = {},
): Record<Hue, HuePalette> {
  return recordOf(HUES, (hue) => drawn(solids[hue] ?? foundationOf(hue, modes), modes));
}
