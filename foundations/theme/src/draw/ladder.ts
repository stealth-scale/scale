/**
 * Places the surfaces of one side of a theme on three ladders from its page, and finds the colors
 * that clear a contrast ratio on them.
 *
 * @remarks
 *   Surfaces rise: the panel and the popover are lighter than the page in both modes. Wells sink:
 *   the three tinted regions are darker than the page in both modes. Fills lift: a control's three
 *   quiet fills step towards the ink, darker on a light page and lighter on a dark one, and above
 *   the popover. Every step is a distance in OKLab lightness, so a subtle button, a subtle card and
 *   a hovered row differ by known amounts on every surface in every theme. Every step goes only as
 *   far as the ink allows: a surface stops rising and a well stops sinking where a secondary ink
 *   could no longer read on it at the text ratio, and the three steps of a ladder compress
 *   together so they stay in proportion. A page of middle lightness under a pale ink has no room
 *   for fills that lift and keep the ink readable, so on such a page the fills sink with the wells.
 */

import { type Palette } from "#contract.ts";
import { atChroma, lightened, lightnessOf, mixed, polar } from "#draw/color.ts";
import { contrast } from "#draw/contrast.ts";

/**
 * Describes one side of a theme: the page and the ink of one mode, and the panel where the
 * theme states one.
 */
export interface Written {
  /**
   * The ink the page is written in.
   */
  ink: string;

  /**
   * The page itself.
   */
  page: string;

  /**
   * The surface a panel is drawn on, where the theme states one rather than leaving it a step
   * above the page.
   */
  panel?: string | undefined;
}

/**
 * Describes the page and the ink of each mode.
 */
export type Inked = Record<"dark" | "light", Written>;

/**
 * Selects one of the two sides a theme is written for.
 */
export type Side = keyof Inked;

/**
 * Describes every surface of one side, placed.
 */
export interface Ladder {
  /**
   * The three quiet fills of a control, from the resting fill to the pressed one.
   */
  fills: readonly [string, string, string];

  /**
   * The ink the side is written in.
   */
  ink: string;

  /**
   * The page.
   */
  page: string;

  /**
   * The raised surface.
   */
  panel: string;

  /**
   * The floating surface.
   */
  popover: string;

  /**
   * The three sunk regions, from the shallowest to the deepest.
   */
  wells: readonly [string, string, string];
}

/**
 * Fixes the ratios the families and the palettes are drawn to.
 */
export interface Ratios {
  /**
   * The ratio a control's boundary, a palette's line and a ring stand from a surface at.
   */
  boundary: number;

  /**
   * The ratio the structural hairline stands from the page and the panel at.
   */
  hairline: number;

  /**
   * The ratio the label on a solid reads at.
   */
  label: number;

  /**
   * The ratio the tertiary ink reads at.
   */
  tertiary: number;

  /**
   * The ratio the ink, the secondary ink and a palette's ink read at.
   */
  text: number;
}

/**
 * Describes what a theme may change about how its colors are drawn.
 */
export interface DrawOptions extends Partial<Ratios> {
  /**
   * The share of the page's chroma a raised surface and a well keep, for a theme whose page is
   * saturated enough that every surface in its tint reads as one wall of color. All of it unless
   * stated.
   */
  chroma?: number | undefined;

  /**
   * Whether a solid stays as stated where it fails a ratio, and the gate reports it: every solid
   * where it is `true`, and the intents named where it is a list.
   */
  keep?: boolean | readonly Palette[] | undefined;
}

/**
 * Fixes the ratios the foundation draws to: text at AAA, a tertiary ink and a label at AA, a
 * boundary at what 1.4.11 asks of a control, and the structural hairline where a separator reads
 * as a line rather than as a shadow.
 */
export const RATIOS: Readonly<Ratios> = {
  boundary: 3,
  hairline: 1.45,
  label: 4.5,
  tertiary: 4.5,
  text: 7,
};

/**
 * Fixes the ratio each measurement may never go below, whatever a theme states.
 *
 * @remarks
 *   These are the minima WCAG asks of normal-size text and of the visual information that
 *   identifies a control, not a target a brand trades against. A theme states `ratios` to say
 *   what it aims for above them, so a palette that cannot carry a color is a palette to change
 *   rather than a threshold to lower. The hairline is left out: a separator carries no
 *   information a reader has to read, so its ratio is a quality target all the way down.
 */
export const FLOOR: Readonly<Omit<Ratios, "hairline">> = {
  boundary: 3,
  label: 4.5,
  tertiary: 4.5,
  text: 4.5,
};

/**
 * Fixes the ratios the two quiet hairlines stand from a surface at, below the structural line the
 * theme's own ratio places.
 */
export const HAIRLINES = { muted: 1.25, subtle: 1.15 } as const;

/**
 * Fixes how far the panel rises above the page on each side.
 */
const PANEL: Readonly<Record<Side, number>> = { dark: 0.04, light: 0.03 };

/**
 * Fixes how far the popover rises above the page on each side, and above a stated panel.
 */
const POPOVER: Readonly<Record<Side, number>> = { dark: 0.07, light: 0.03 };

/**
 * Fixes how far each well sinks below the page, and how far each fill steps on a light page.
 */
const STEPS: readonly [number, number, number] = [0.04, 0.08, 0.13];

/**
 * Fixes how far each fill lifts above a dark page, which is above the popover.
 */
const LIFTS: readonly [number, number, number] = [0.11, 0.16, 0.22];

/**
 * Fixes how many halvings a search runs, which places the answer within a thousandth.
 */
const HALVINGS = 12;

/**
 * Fixes the lightness a secondary ink keeps from the ink, which is the room every surface leaves
 * it.
 */
const ROOM = 0.03;

/**
 * Reads the ratios a theme draws to: the foundation's, with any the theme restated over them,
 * and none of them below the floor.
 *
 * @remarks
 *   A theme lowers a target to what its colors can reach, and the floor is where lowering stops.
 *   A theme that states three for its labels is drawn at four and a half and the gate measures it
 *   there, so the colors move or the palette does.
 */
export function ratiosOf(options: DrawOptions = {}): Ratios {
  return {
    boundary: Math.max(options.boundary ?? RATIOS.boundary, FLOOR.boundary),
    hairline: options.hairline ?? RATIOS.hairline,
    label: Math.max(options.label ?? RATIOS.label, FLOOR.label),
    tertiary: Math.max(options.tertiary ?? RATIOS.tertiary, FLOOR.tertiary),
    text: Math.max(options.text ?? RATIOS.text, FLOOR.text),
  };
}

/**
 * Reports whether a side is drawn dark, which is whether its ink is lighter than its page.
 */
export function isDark(side: Written): boolean {
  return lightnessOf(side.ink) > lightnessOf(side.page);
}

/**
 * Moves a surface a distance in lightness from another, in the same tint, clamped to the display.
 */
function moved(surface: string, by: number): string {
  return lightened(surface, lightnessOf(surface) + by);
}

/**
 * Reads the ink a surface has to leave room for: the ink moved a step towards the page, which is
 * where a secondary ink lands at the least.
 */
function secondary(side: Written): string {
  return moved(side.ink, isDark(side) ? -ROOM : ROOM);
}

/**
 * Measures how far from the page, up to a limit, a surface can go before the secondary ink stops
 * reading on it at the text ratio.
 *
 * @remarks
 *   The limit is signed: positive to rise and negative to sink. A page the ink cannot read on at
 *   all gives the whole limit back, so the ladder keeps its shape and the gate reports the ink.
 */
function reach(side: Written, limit: number, text: number): number {
  const reference = secondary(side);

  /**
   * Reports whether the secondary ink reads on the page moved a distance.
   */
  const holds = (distance: number): boolean =>
    contrast(reference, moved(side.page, distance)) >= text;

  if (holds(limit) || !holds(0)) return Math.abs(limit);

  let held = 0;
  let failed = limit;

  for (let round = 0; round < HALVINGS; round += 1) {
    const middle = (held + failed) / 2;

    if (holds(middle)) held = middle;
    else failed = middle;
  }

  return Math.abs(held);
}

/**
 * Scales three steps so the furthest reaches no further than a distance.
 */
function within(
  steps: readonly [number, number, number],
  distance: number,
): readonly [number, number, number] {
  const scale = Math.min(1, distance / steps[2]);

  return [steps[0] * scale, steps[1] * scale, steps[2] * scale];
}

/**
 * Places the three fills of a side: towards the ink, unless a secondary ink would have no room
 * on the deepest one, in which case they sink with the wells.
 */
function fillsOf(
  side: Written,
  wells: readonly [string, string, string],
  text: number,
): Ladder["fills"] {
  if (!isDark(side)) return wells;

  const lifted: [string, string, string] = [
    moved(side.page, LIFTS[0]),
    moved(side.page, LIFTS[1]),
    moved(side.page, LIFTS[2]),
  ];
  const faint = faded(side.ink, side.page, [lifted[2]], text);

  return Math.abs(lightnessOf(faint) - lightnessOf(side.ink)) >= ROOM ? lifted : wells;
}

/**
 * Takes a surface towards grey, to the share of the page's chroma the theme keeps.
 *
 * @remarks
 *   A page saturated enough to read as a color rather than as a tint makes every surface drawn in
 *   its tint one wall of that color. A theme that tapers its surfaces keeps the hue and gives up
 *   some of the chroma, which leaves a grey page untouched because it had almost none to give.
 */
function tapered(surface: string, page: string, share: number): string {
  return share === 1 ? surface : atChroma(surface, polar(page).chroma * Math.min(share, 1));
}

/**
 * Places every surface of one side on its ladder.
 *
 * @remarks
 *   A stated panel is kept as stated. The popover above it rises a step further, but no further
 *   than the secondary ink allows, and no lower than the panel itself. Every raised surface and
 *   every well is tapered towards grey where the theme states a share of its page's chroma, and
 *   the fills are not, because a fill carries a palette's own hue.
 * @param side - The page and the ink, and the panel where the theme states one.
 * @param options - The ratios the theme draws to and the chroma its surfaces keep.
 */
export function ladderOf(side: Written, options: DrawOptions = {}): Ladder {
  const { text } = ratiosOf(options);
  const share = options.chroma ?? 1;
  const mode: Side = isDark(side) ? "dark" : "light";
  const ceiling =
    side.panel === undefined
      ? POPOVER[mode]
      : Math.max(POPOVER[mode], lightnessOf(side.panel) + PANEL.light - lightnessOf(side.page));
  const rise = reach(side, ceiling, text);
  const rises = within([PANEL[mode], POPOVER[mode], POPOVER[mode]], rise);
  const sinks = within(STEPS, reach(side, -STEPS[2], text));
  const panel = side.panel ?? moved(side.page, rises[0]);
  const popover =
    side.panel === undefined
      ? moved(side.page, rises[1])
      : lightened(
          side.panel,
          Math.max(
            lightnessOf(side.panel),
            Math.min(lightnessOf(side.panel) + PANEL.light, lightnessOf(side.page) + rise),
          ),
        );
  const wells: [string, string, string] = [
    moved(side.page, -sinks[0]),
    moved(side.page, -sinks[1]),
    moved(side.page, -sinks[2]),
  ];

  return {
    fills: fillsOf(side, wells, text),
    ink: side.ink,
    page: side.page,
    panel: tapered(panel, side.page, share),
    popover: tapered(popover, side.page, share),
    wells: [
      tapered(wells[0], side.page, share),
      tapered(wells[1], side.page, share),
      tapered(wells[2], side.page, share),
    ],
  };
}

/**
 * Reports whether a color clears a ratio against every color it is measured on.
 */
function clears(color: string, against: readonly string[], ratio: number): boolean {
  return against.every((back) => contrast(color, back) >= ratio);
}

/**
 * Finds by halving the share between two bounds at which a predicate turns, with the lower bound
 * holding and the upper bound failing.
 *
 * @returns The last share that held and the first that failed, a thousandth apart.
 */
function turned(holds: (share: number) => boolean): readonly [held: number, failed: number] {
  let held = 0;
  let failed = 1;

  for (let round = 0; round < HALVINGS; round += 1) {
    const middle = (held + failed) / 2;

    if (holds(middle)) held = middle;
    else failed = middle;
  }

  return [held, failed];
}

/**
 * Fades a color as far towards another as it can go while it still clears a ratio against every
 * color given, and returns the color where it stops.
 *
 * @remarks
 *   This draws a faded ink from the ink: the lightest secondary ink that still reads at the ratio
 *   on the worst surface. A color that fails the ratio before it moves is returned as it is, and
 *   the gate reports the pair.
 * @param from - The color to fade.
 * @param towards - The color to fade towards, which is the page.
 * @param against - The colors the result has to read on.
 * @param ratio - The ratio it has to keep.
 */
export function faded(
  from: string,
  towards: string,
  against: readonly string[],
  ratio: number,
): string {
  if (!clears(from, against, ratio)) return from;
  if (clears(mixed(from, towards, 1), against, ratio)) return mixed(from, towards, 1);

  const [held] = turned((share) => clears(mixed(from, towards, share), against, ratio));

  return mixed(from, towards, held);
}

/**
 * Moves a color on from another by a step in lightness, towards a third, where the two would
 * otherwise be too close to tell apart.
 *
 * @remarks
 *   This keeps the four lines of a family a step apart on a dark page, where two hairlines drawn
 *   to ratios a tenth apart land within a hundredth of each other.
 * @param previous - The color the step is measured from.
 * @param color - The color to move on.
 * @param towards - The color the step is taken towards, which is the ink.
 * @param step - The least distance in lightness the two keep.
 */
export function apart(previous: string, color: string, towards: string, step: number): string {
  const from = lightnessOf(previous);

  if (Math.abs(lightnessOf(color) - from) >= step) return color;

  return lightened(color, from + (lightnessOf(towards) >= from ? step : -step));
}

/**
 * Raises a color only as far towards another as it needs to clear a ratio against every color
 * given, and returns the color where it gets there.
 *
 * @remarks
 *   This draws a line from the page and a palette's ink and line from its solid: the least the
 *   color has to move towards the ink to read. A color that already clears the ratio is returned
 *   as it is, and one that fails even at the ink is returned as the ink, and the gate reports it.
 * @param from - The color to raise.
 * @param towards - The color to raise towards, which is the ink.
 * @param against - The colors the result has to read on.
 * @param ratio - The ratio it has to reach.
 */
export function raised(
  from: string,
  towards: string,
  against: readonly string[],
  ratio: number,
): string {
  if (clears(from, against, ratio)) return from;
  if (!clears(mixed(from, towards, 1), against, ratio)) return mixed(from, towards, 1);

  const [, clearing] = turned((share) => !clears(mixed(from, towards, share), against, ratio));

  return mixed(from, towards, clearing);
}
