/**
 * Draws the code family: the ink of every kind of token a passage of code is set in.
 *
 * @remarks
 *   A theme names a color per kind the way it names an intent's solid, in one color or one per
 *   mode, and the ink is drawn from it at the distance a code ink stands from the page. A theme
 *   built from four colors names the kinds it has colors for and takes the foundation's hues for
 *   the rest, so a passage is told apart by kind on every theme and drawn in the theme's colors
 *   where it has them.
 */

import { CODE, type Code, type Filled, type Hue, type Moded } from "#contract.ts";
import { mixed, read, referenced, stated } from "#draw/color.ts";
import {
  type DrawOptions,
  type Inked,
  ladderOf,
  raised,
  ratiosOf,
  type Written,
} from "#draw/ladder.ts";
import { canonical, sideOf, type Solid } from "#draw/palette.ts";
import { recordOf } from "#record.ts";

/**
 * Fixes how far from the page, along the OKLab lightness axis, the ink of a kind of code token
 * has to stand.
 *
 * @remarks
 *   Further than a palette's ink. A passage of code is read one token at a time in a monospaced
 *   face, and a keyword drawn at the distance a button's label is drawn at reads as dim beside the
 *   plain text around it. The distance holds every default ink at seven to one against the
 *   foundation's pages, which the scale's own specification measures.
 */
const APART = 0.58;

/**
 * Fixes the share of the way from the page to the ink a code ink may be pushed at most.
 *
 * @remarks
 *   A page drawn at a middle lightness, which a theme built from a navy or a slate has, leaves
 *   less room between the page and the ink than the distance asks for, and a color pushed the
 *   whole distance lands on the ink and loses its hue with every other kind. Held to a share of
 *   the room, the inks stay apart from the ink and from each other on such a page.
 */
const SHARE = 0.75;

/**
 * Fixes the hue each kind of code token is inked from where a theme names no color for it.
 *
 * @remarks
 *   Six hues tell the kinds apart at a glance: a keyword purple, a string orange, a number green,
 *   a function yellow, a type and a tag teal, an attribute cyan. A change is the red or the green
 *   of the diff it is, and a comment is the muted ink, so it reads as an aside.
 */
const KINDS: Readonly<Record<Exclude<Code, "comment">, Hue>> = {
  attr: "cyan",
  deleted: "red",
  function: "yellow",
  inserted: "green",
  keyword: "purple",
  number: "green",
  string: "orange",
  tag: "teal",
  type: "teal",
};

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
 * Finds how far from the page a code ink stands on one side: the fixed distance, or the share of
 * the room between the page and the ink where the room is smaller.
 */
function apartOn(side: Written): number {
  return Math.min(APART, SHARE * Math.abs(read(side.ink).l - read(side.page).l));
}

/**
 * Pushes a color towards a side's ink until it stands that side's distance from the page, and
 * then until it reads on every surface a passage of code is set on.
 *
 * @remarks
 *   The distance places the kinds apart from each other, which is what a reader tells them by.
 *   The ratio is what a reader reads them by, and a distance in lightness is not one: a hue whose
 *   lightness stands well clear of the page can still fail the text ratio on it. The distance
 *   comes first so the kinds keep their spread, and the ratio is applied after so none of them
 *   falls below what the theme draws its text to.
 */
function pushed(color: string, side: Written, options: DrawOptions): string {
  const apart = mixed(color, side.ink, towards(color, side.ink, side.page, apartOn(side)));
  const ladder = ladderOf(side, options);

  return raised(apart, side.ink, [ladder.page, ladder.panel], ratiosOf(options).text);
}

/**
 * Draws the ink of one kind of code token from its color, on each side.
 */
function inkOf(solid: Solid, modes: Inked, options: DrawOptions): Moded {
  return stated(
    pushed(sideOf(solid, "light"), modes.light, options),
    pushed(sideOf(solid, "dark"), modes.dark, options),
  );
}

/**
 * Draws the code family: the ink of every kind of token, each from the color the theme names for
 * it, or from the foundation's hue where it names none, and the comment from the muted ink.
 *
 * @param modes - The page and the ink of each mode.
 * @param colors - The color each stated kind is drawn from.
 * @returns The family, under `code`, to spread into a theme's colors.
 */
export function coded(
  modes: Inked,
  colors: Readonly<Partial<Record<Code, Solid>>> = {},
  options: DrawOptions = {},
): Record<"code", Record<Code, Filled>> {
  return {
    code: recordOf(CODE, (kind) => {
      const named = colors[kind];

      if (named !== undefined) return inkOf(named, modes, options);
      if (kind === "comment") return referenced("fg.muted");

      return inkOf(canonical(KINDS[kind]), modes, options);
    }),
  };
}
