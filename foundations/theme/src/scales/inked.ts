/**
 * Draws the three families of a theme from a palette that states its colors outright: the page
 * and the ink of each mode, and a ramp from a color.
 *
 * @remarks
 *   A theme drawn this way adds no grey of its own. Every surface is the page moved a fixed
 *   distance in the page's own tint, every line is the page mixed towards the ink, every faded ink
 *   is the ink mixed towards the page, and every ramp is drawn in the hue and at the chroma of a
 *   color the palette states. What is not a palette color is a tint of one.
 */

import { type Filled, type Moded, type Status, STATUSES } from "#authoring/contract.ts";
import { oklab, type Oklab } from "#authoring/contrast.ts";
import { type Tokens } from "#pandacss.ts";
import { recordOf } from "#record.ts";
import { backgrounds, colorScale, oklch } from "#scales/color.ts";
import { type Families } from "#scales/palettes.ts";

/**
 * Describes the colors a ramp carries.
 */
type Colors = NonNullable<Tokens["colors"]>;

/**
 * Describes a page and the ink it is written in, each stated as CSS writes a color, with the
 * surface a panel is drawn on where the palette states one.
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
   * The surface a panel and a popover are drawn on, where the palette states one rather than
   * leaving it a step from the page.
   */
  panel?: string | undefined;
}

/**
 * Describes the page and the ink of each mode.
 */
export type Inked = Record<"dark" | "light", Written>;

/**
 * Selects one of the two modes a page is written for.
 */
export type Side = keyof Inked;

/**
 * Describes a color as OKLCH reads it: how light, how far from grey, and where on the wheel.
 */
interface Polar {
  /**
   * Distance from grey.
   */
  chroma: number;

  /**
   * Degrees around the wheel, from 0 to 360.
   */
  hue: number;

  /**
   * Percent, from black to white.
   */
  lightness: number;
}

/**
 * Lists the surfaces drawn a fixed distance from the page, which are every surface but the page,
 * its panel and its inverse.
 */
const DISTANCED = ["backdrop", "disabled", "emphasized", "muted", "subtle"] as const;

/**
 * Fixes how far each faded ink is mixed towards the page.
 */
const FADES = { muted: 0.25, subtle: 0.5 };

/**
 * Fixes how far each line is mixed from the page towards the ink.
 */
const WEIGHTS = { DEFAULT: 0.2, emphasized: 0.45, muted: 0.12, subtle: 0.08 };

/**
 * Fixes the chroma below which a color is a grey, whose hue is noise and reads as zero.
 */
const GREY = 0.0001;

/**
 * Writes one color outright in each mode.
 *
 * @param light - The color in light mode.
 * @param dark - The color in dark mode, which is the same color unless another is named.
 */
export function stated(light: string, dark = light): Moded {
  return { value: { _dark: dark, base: light } };
}

/**
 * Reads an OKLab color as OKLCH reads it.
 */
function polarOf(lab: Oklab): Polar {
  const chroma = Math.hypot(lab.a, lab.b);
  const hue = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;

  return { chroma, hue: chroma < GREY ? 0 : (hue + 360) % 360, lightness: lab.l * 100 };
}

/**
 * Reads a color into OKLab.
 *
 * @throws {@link Error} When the color is not one CSS writes as OKLCH, hex or `rgb()`.
 */
export function read(color: string): Oklab {
  const lab = oklab(color);

  if (lab === undefined) throw new Error(`${color} is not a color a theme can be drawn from`);

  return lab;
}

/**
 * Reads a color as OKLCH reads it.
 */
function polar(color: string): Polar {
  return polarOf(read(color));
}

/**
 * Mixes one color a share of the way towards another in OKLab, and writes the result as OKLCH.
 *
 * @param from - The color mixed from.
 * @param to - The color mixed towards.
 * @param share - How far to go, 0 for the first color and 1 for the second.
 */
export function mixed(from: string, to: string, share: number): string {
  const one = read(from);
  const other = read(to);
  const { chroma, hue, lightness } = polarOf({
    a: one.a + (other.a - one.a) * share,
    b: one.b + (other.b - one.b) * share,
    l: one.l + (other.l - one.l) * share,
  });

  return oklch(lightness, chroma, hue);
}

/**
 * Draws the eleven steps of the hue a color is drawn in, at its chroma.
 *
 * @param color - The color the ramp is drawn from.
 */
export function scaleOf(color: string): Colors {
  const { chroma, hue } = polar(color);

  return colorScale(hue, chroma);
}

/**
 * Writes a reference to a color token that carries both modes itself.
 */
function referenced(path: string): Filled {
  return { value: `{colors.${path}}` };
}

/**
 * Writes the status members of a family, each a reference into a status palette's role.
 */
function statuses(role: string): Record<Status, Filled> {
  return recordOf(STATUSES, (status) => referenced(`${status}.${role}`));
}

/**
 * Mixes from one of a mode's colors towards the other, in both modes.
 */
function between(modes: Inked, from: "ink" | "page", to: "ink" | "page", share: number): Moded {
  return stated(
    mixed(modes.light[from], modes.light[to], share),
    mixed(modes.dark[from], modes.dark[to], share),
  );
}

/**
 * Describes the surfaces drawn a distance from the page, each carrying both modes.
 */
type Distanced = Record<"panel" | (typeof DISTANCED)[number], Moded>;

/**
 * Draws the surfaces of one side a fixed distance from its page, in the page's own tint, and
 * reads that side of each.
 */
function distanced(modes: Inked, side: Side): Record<keyof Distanced, string> {
  const { chroma, hue } = polar(modes[side].page);
  const pages = {
    dark: polar(modes.dark.page).lightness,
    light: polar(modes.light.page).lightness,
  };
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every surface but the status members carries both modes
  const drawn = backgrounds(pages, hue, chroma) as Distanced;

  return recordOf(
    [...DISTANCED, "panel"],
    (member) => drawn[member].value[side === "dark" ? "_dark" : "base"],
  );
}

/**
 * Draws the surfaces from the pages: the page itself, its panel where one is stated, its inverse
 * from the other side, and every other surface a fixed distance away in the page's own tint.
 */
function surfaces(modes: Inked): Families["bg"] {
  const light = distanced(modes, "light");
  const dark = distanced(modes, "dark");
  const panel = stated(modes.light.panel ?? light.panel, modes.dark.panel ?? dark.panel);

  return {
    ...recordOf(DISTANCED, (member) => stated(light[member], dark[member])),
    DEFAULT: stated(modes.light.page, modes.dark.page),
    inverted: stated(modes.dark.page, modes.light.page),
    panel,
    popover: panel,
    ...statuses("subtle"),
  };
}

/**
 * Draws the inks: the ink itself, the faded ones mixed towards the page, and the inverse from the
 * other side.
 */
function inks(modes: Inked): Families["fg"] {
  return {
    DEFAULT: stated(modes.light.ink, modes.dark.ink),
    disabled: referenced("fg.subtle"),
    inverted: stated(modes.dark.ink, modes.light.ink),
    link: referenced("primary.fg"),
    muted: between(modes, "ink", "page", FADES.muted),
    subtle: between(modes, "ink", "page", FADES.subtle),
    ...statuses("fg"),
  };
}

/**
 * Draws the lines, each the page mixed towards the ink by its weight, and the inverse from the
 * other side.
 */
function lines(modes: Inked): Families["border"] {
  return {
    DEFAULT: between(modes, "page", "ink", WEIGHTS.DEFAULT),
    emphasized: between(modes, "page", "ink", WEIGHTS.emphasized),
    focus: referenced("primary.focusRing"),
    inverted: stated(
      mixed(modes.dark.page, modes.dark.ink, WEIGHTS.DEFAULT),
      mixed(modes.light.page, modes.light.ink, WEIGHTS.DEFAULT),
    ),
    muted: between(modes, "page", "ink", WEIGHTS.muted),
    subtle: between(modes, "page", "ink", WEIGHTS.subtle),
    ...statuses("border"),
  };
}

/**
 * Draws the three families from the page and the ink of each mode.
 *
 * @remarks
 *   The page and the ink are taken as stated. Every surface is the page moved a fixed distance in
 *   its own tint, every line is the page mixed towards the ink, and every faded ink is the ink
 *   mixed towards the page, so the families hold no color the palette did not state or tint.
 * @param modes - The page and the ink of each mode.
 */
export function inked(modes: Inked): Families {
  return { bg: surfaces(modes), border: lines(modes), fg: inks(modes) };
}
