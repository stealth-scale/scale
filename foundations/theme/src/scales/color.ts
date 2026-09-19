/**
 * Draws the colors a theme states: a ramp from a hue, the surfaces a page is built from, the inks
 * and the lines on it, and the twelve roles a palette fills.
 *
 * @remarks
 *   Every color is OKLCH, so a hue moves without its lightness moving with it. A theme states a
 *   hue and a chroma, and the shape of every ramp is the same, which is what makes two themes
 *   comparable at a glance.
 */

import {
  type Family,
  type Filled,
  type HuePalette,
  type Moded,
  type PaletteRoles,
  type Referenced,
  type Role,
  type SemanticPalette,
  type Status,
  STATUSES,
} from "#authoring/contract.ts";
import { type Tokens } from "#pandacss.ts";
import { recordOf } from "#record.ts";

/**
 * Describes the colors a ramp carries.
 */
type Colors = NonNullable<Tokens["colors"]>;

/**
 * Describes the surfaces a page is built from.
 */
type Backgrounds = Family<
  | "backdrop"
  | "DEFAULT"
  | "disabled"
  | "emphasized"
  | "inverted"
  | "muted"
  | "panel"
  | "popover"
  | "subtle"
>;

/**
 * Describes the inks a page is written in.
 */
type Foregrounds = Family<"DEFAULT" | "disabled" | "inverted" | "link" | "muted" | "subtle">;

/**
 * Describes the lines between things.
 */
type Borders = Family<"DEFAULT" | "emphasized" | "focus" | "inverted" | "muted" | "subtle">;

/**
 * Describes the tint every surface of a page is drawn with.
 */
interface Tint {
  /**
   * How far from grey the tint goes.
   */
  chroma: number;

  /**
   * The hue, in degrees around the wheel.
   */
  hue: number;
}

/**
 * Places each step of a ramp: how light it is, and how much of the stated chroma it takes.
 *
 * @remarks
 *   The steps run closer together at the dark end than at the light end, because a dark page is
 *   built from four surfaces that all have to sit under a light ink at 7:1. Saturation falls away
 *   at both ends because a color at 97% lightness cannot hold much chroma without turning pastel,
 *   and one at 15% cannot without turning to mud.
 */
const STOPS: ReadonlyArray<readonly [step: number, lightness: number, saturation: number]> = [
  [50, 97, 0.18],
  [100, 94, 0.32],
  [200, 88, 0.55],
  [300, 80, 0.78],
  [400, 72, 0.94],
  [500, 58, 1],
  [600, 47, 0.98],
  [700, 37, 0.9],
  [800, 28, 0.75],
  [900, 21, 0.58],
  [950, 15, 0.42],
];

/**
 * Places each step of an alpha ramp: how opaque a white or a black overlay is.
 */
const ALPHAS: ReadonlyArray<readonly [step: number, alpha: number]> = [
  [50, 0.04],
  [100, 0.06],
  [200, 0.08],
  [300, 0.16],
  [400, 0.24],
  [500, 0.36],
  [600, 0.48],
  [700, 0.64],
  [800, 0.8],
  [900, 0.92],
  [950, 0.95],
];

/**
 * Selects one step of a ramp: a number for a ramp keyed by number, or a string for a ramp keyed
 * the way its source keys it.
 */
export type Step = number | string;

/**
 * Places each member of a group on a ramp, as a step for light mode and a step for dark mode, or
 * fills it with a color stated outright.
 *
 * @typeParam Member - The members the group names.
 * @typeParam Leaf - The shape a color stated outright takes.
 */
export type Steps<Member extends string, Leaf extends Filled = Filled> = Readonly<
  Record<Member, Leaf | readonly [light: Step, dark: Step]>
>;

/**
 * Places each of the twelve roles on a ramp. A role stated outright carries both modes, because
 * a hue palette states every role in both.
 */
export type RoleSteps = Steps<Role, Moded>;

/**
 * Places each role on the ramp, in light mode and then in dark mode.
 *
 * @remarks
 *   The steps are the ones the accessibility gate accepts on a ramp the foundation draws: every
 *   ink clears 7:1 on every fill it is drawn on, and every border and ring clears 3:1 on the
 *   page. A theme on a ramp of another shape states its own table.
 */
export const ROLE_STEPS: RoleSteps = {
  bg: [50, 950],
  border: [500, 500],
  "border.hover": [600, 400],
  contrast: [50, 950],
  emphasized: [300, 700],
  fg: [950, 50],
  "fg.muted": [900, 200],
  focusRing: [600, 400],
  muted: [200, 800],
  solid: [700, 400],
  "solid.hover": [800, 300],
  subtle: [100, 900],
};

/**
 * Places each ink on the grey ramp, in light mode and then in dark mode.
 *
 * @remarks
 *   `muted` clears 7:1 on every surface and `subtle` clears 3:1, which is the boundary ratio and
 *   not the text ratio, so a recipe never writes `subtle` as a text color.
 */
export const FOREGROUND_STEPS: Steps<"DEFAULT" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [950, 50],
  inverted: [50, 950],
  muted: [800, 300],
  subtle: [600, 500],
};

/**
 * Places each line on the grey ramp, one step further from the page at each weight.
 *
 * @remarks
 *   `emphasized` clears 3:1 on every surface, which is what 1.4.11 asks of a control's edge.
 */
export const BORDER_STEPS: Steps<"DEFAULT" | "emphasized" | "inverted" | "muted" | "subtle"> = {
  DEFAULT: [300, 700],
  emphasized: [600, 500],
  inverted: [700, 300],
  muted: [200, 800],
  subtle: [100, 900],
};

/**
 * Reports whether a table entry is a pair of steps rather than a color stated outright.
 */
function isSteps(entry: Filled | readonly [Step, Step]): entry is readonly [Step, Step] {
  return Array.isArray(entry);
}

/**
 * Fixes the chroma at which a hue reads as a color rather than as a tinted grey.
 */
const SATURATED = 0.1;

/**
 * Describes where the page sits in each color mode.
 */
export interface PageLightness {
  /**
   * The lightness of the page in dark mode, as a percentage.
   */
  dark: number;

  /**
   * The lightness of the page in light mode, as a percentage.
   */
  light: number;
}

/**
 * Writes one OKLCH color as CSS writes it.
 *
 * @param lightness - Percent, from black to white.
 * @param chroma - Distance from grey.
 * @param hue - Degrees around the wheel.
 */
export function oklch(lightness: number, chroma: number, hue: number): string {
  return `oklch(${lightness.toFixed(1)}% ${chroma.toFixed(4)} ${hue.toFixed(1)})`;
}

/**
 * Keeps a near-grey ramp at its stated chroma, and lets a saturated one fall away at the ends.
 *
 * @remarks
 *   A grey that lost chroma at the ends would read as two different greys, and a blue that kept
 *   it would read as pastel at the top and mud at the bottom.
 */
function share(saturation: number, chroma: number): number {
  const risk = Math.min(chroma / SATURATED, 1);

  return saturation * risk + (1 - risk);
}

/**
 * Writes one step of the ramp a hue and a chroma draw, as CSS reads it.
 *
 * @param hue - Degrees around the wheel.
 * @param chroma - How far from grey the middle of the ramp sits.
 * @param step - The step to write, `50` to `950`.
 * @throws {@link Error} When no ramp has the step.
 */
export function stepOf(hue: number, chroma: number, step: number): string {
  const stop = STOPS.find(([at]) => at === step);

  if (stop === undefined) throw new Error(`${String(step)} is not a step of a ramp`);

  const [, lightness, saturation] = stop;

  return oklch(lightness, chroma * share(saturation, chroma), hue);
}

/**
 * Draws the eleven steps of one hue, keyed `50` to `950`.
 *
 * @param hue - Degrees around the wheel.
 * @param chroma - How far from grey the middle of the ramp sits.
 */
export function colorScale(hue: number, chroma: number): Colors {
  return Object.fromEntries(
    STOPS.map(([step]) => [String(step), { value: stepOf(hue, chroma, step) }]),
  );
}

/**
 * Draws the eleven steps of a white or a black overlay, keyed `50` to `950`.
 *
 * @param base - Whether the overlay lightens or darkens what it covers.
 */
export function alphaScale(base: "black" | "white"): Colors {
  const lightness = base === "white" ? 100 : 0;

  return Object.fromEntries(
    ALPHAS.map(([step, alpha]) => [
      String(step),
      { value: `oklch(${String(lightness)}% 0 0 / ${alpha.toFixed(2)})` },
    ]),
  );
}

/**
 * Keys a ramp a theme transcribes from its source, step by step.
 *
 * @remarks
 *   The keys are the source's own, so a role table reads in the source's vocabulary and a reader
 *   can check a value against the source by its name.
 * @param keys - The step names, from the lightest to the darkest.
 * @param values - One color per step, as CSS reads it.
 * @throws {@link Error} When the two lists differ in length.
 */
export function ramp(keys: readonly Step[], values: readonly string[]): Colors {
  if (keys.length !== values.length) {
    throw new Error(`${String(keys.length)} steps were named for ${String(values.length)} colors`);
  }

  return Object.fromEntries(values.map((value, index) => [String(keys[index]), { value }]));
}

/**
 * Writes a reference to one step of a ramp in light mode and another in dark mode.
 *
 * @remarks
 *   The dark step is read from the same ramp unless another is named, which a theme does where
 *   its source draws its dark mode as a ramp of its own.
 */
export function stepped(name: string, light: Step, dark: Step, darkName = name): Moded {
  return {
    value: {
      _dark: `{colors.${darkName}.${String(dark)}}`,
      base: `{colors.${name}.${String(light)}}`,
    },
  };
}

/**
 * Fills each member of a group from its table entry: a pair of steps as references into the
 * ramp, or a color stated outright as it is.
 */
function tabled<Member extends string>(
  name: string,
  steps: Steps<Member>,
  darkName: string,
): Record<Member, Filled> {
  const filled = Object.fromEntries(
    Object.entries<Filled | readonly [Step, Step]>(steps).map(([member, entry]) => [
      member,
      isSteps(entry) ? stepped(name, entry[0], entry[1], darkName) : entry,
    ]),
  );

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- fromEntries widens the keys the table already narrows
  return filled as Record<Member, Filled>;
}

/**
 * Places each surface of a page on a ramp, with the backdrop stated outright where a source
 * names one.
 */
export type SurfaceSteps = {
  /**
   * The overlay behind a dialog, or the foundation's where the source names none.
   */
  backdrop?: Filled | undefined;
} & Steps<Exclude<keyof Backgrounds, "backdrop" | Status>>;

/**
 * Writes a reference to a color token that carries both modes itself.
 */
function referenced(path: string): Referenced {
  return { value: `{colors.${path}}` };
}

/**
 * Writes the status members of a family, each a reference into a status palette's role.
 */
function statuses(role: string): Record<Status, Filled> {
  return recordOf(STATUSES, (status) => referenced(`${status}.${role}`));
}

/**
 * Places one surface a number of percentage points from a page, clamped so a surface near white
 * or near black stops rather than wraps.
 */
function lit(page: number, steps: number, tint: Tint): string {
  return oklch(Math.min(Math.max(page + steps, 0), 100), tint.chroma, tint.hue);
}

/**
 * Places a surface the same distance away from both pages, which is towards white on a dark page
 * and towards black on a light one.
 */
function away(pages: PageLightness, steps: number, tint: Tint): Moded {
  return { value: { _dark: lit(pages.dark, steps, tint), base: lit(pages.light, -steps, tint) } };
}

/**
 * Places a surface at one distance on a dark page and another on a light one, where the two pages
 * do not want the same step.
 */
function split(pages: PageLightness, dark: number, light: number, tint: Tint): Moded {
  return { value: { _dark: lit(pages.dark, dark, tint), base: lit(pages.light, light, tint) } };
}

/**
 * Draws the surfaces a page is built from, each a fixed distance from the page itself.
 *
 * @remarks
 *   The distances are signed rather than absolute: a panel is lighter than a dark page and darker
 *   than a light one, so one number covers both modes. The status members reference the status
 *   palettes' quiet fills.
 * @param pages - Where the page sits in each mode.
 * @param hue - The hue every surface is tinted with.
 * @param chroma - How far that tint goes.
 */
export function backgrounds(pages: PageLightness, hue: number, chroma: number): Backgrounds {
  const tint = { chroma, hue };

  return {
    backdrop: { value: { _dark: "oklch(0% 0 0 / 0.64)", base: "oklch(0% 0 0 / 0.44)" } },
    DEFAULT: split(pages, 0, 0, tint),
    disabled: away(pages, 7, tint),
    emphasized: away(pages, 11, tint),
    inverted: split(pages, pages.light - pages.dark, pages.dark - pages.light, tint),
    muted: away(pages, 7, tint),
    panel: split(pages, 4, 3, tint),
    popover: split(pages, 7, 3, tint),
    subtle: split(pages, 4, -2, tint),
    ...statuses("subtle"),
  };
}

/**
 * Draws the surfaces a page is built from as steps of a ramp, for a theme whose source states
 * its surfaces on its neutral scale rather than at a distance from the page.
 *
 * @remarks
 *   The backdrop is the foundation's overlay unless the table states one, because few sources
 *   name a step for it. The status members reference the status palettes' quiet fills.
 * @param name - The ramp the surfaces are read from.
 * @param steps - Where each surface sits on the ramp in each mode.
 * @param darkName - The ramp the dark steps are read from, where the source draws one.
 */
export function surfaces(name: string, steps: SurfaceSteps, darkName = name): Backgrounds {
  const { backdrop, ...rest } = steps;

  return {
    backdrop: backdrop ?? {
      value: { _dark: "oklch(0% 0 0 / 0.64)", base: "oklch(0% 0 0 / 0.44)" },
    },
    ...tabled(name, rest, darkName),
    ...statuses("subtle"),
  };
}

/**
 * Draws the inks a page is written in, against the grey ramp it was built from.
 *
 * @remarks
 *   The link ink and the status inks reference the palettes that own them, and the disabled ink
 *   references the subtle one. A theme on another neutral scale states where each ink sits.
 * @param name - The ramp to read, which is the theme's grey unless it says otherwise.
 * @param steps - Where each ink sits on the ramp in each mode.
 * @param darkName - The ramp the dark steps are read from, where the source draws one.
 */
export function foregrounds(name = "gray", steps = FOREGROUND_STEPS, darkName = name): Foregrounds {
  return {
    disabled: referenced("fg.subtle"),
    link: referenced("primary.fg"),
    ...tabled(name, steps, darkName),
    ...statuses("fg"),
  };
}

/**
 * Draws the lines between things, one step further from the page at each weight.
 *
 * @remarks
 *   The focus line references the primary palette's ring, and the status lines the palettes that
 *   own them. A theme on another neutral scale states where each line sits.
 * @param name - The ramp to read.
 * @param steps - Where each line sits on the ramp in each mode.
 * @param darkName - The ramp the dark steps are read from, where the source draws one.
 */
export function borders(name = "gray", steps = BORDER_STEPS, darkName = name): Borders {
  return {
    focus: referenced("primary.focusRing"),
    ...tabled(name, steps, darkName),
    ...statuses("border"),
  };
}

/**
 * Nests the twelve roles the way the compiler reads them, each filled by one call.
 *
 * @typeParam Leaf - The shape each role is filled with.
 */
function roles<Leaf>(fill: (role: Role) => Leaf): PaletteRoles<Leaf> {
  return {
    bg: fill("bg"),
    border: { DEFAULT: fill("border"), hover: fill("border.hover") },
    contrast: fill("contrast"),
    emphasized: fill("emphasized"),
    fg: { DEFAULT: fill("fg"), muted: fill("fg.muted") },
    focusRing: fill("focusRing"),
    muted: fill("muted"),
    solid: { DEFAULT: fill("solid"), hover: fill("solid.hover") },
    subtle: fill("subtle"),
  };
}

/**
 * Draws the twelve roles of a hue palette from its ramp, each in both modes.
 *
 * @remarks
 *   A recipe never names a step of a ramp. It names a role, and the ramp decides which step fills
 *   it, which is what lets one recipe draw in every palette an application installs. The table
 *   is the foundation's unless the theme states one, and a theme whose source draws its dark
 *   mode as a second ramp names that ramp.
 * @param name - The ramp the roles are drawn from.
 * @param steps - Where each role sits on the ramp in each mode.
 * @param darkName - The ramp the dark steps are read from.
 */
export function paletteRoles(name: string, steps = ROLE_STEPS, darkName = name): HuePalette {
  return roles((role) => {
    const entry = steps[role];

    return isSteps(entry) ? stepped(name, entry[0], entry[1], darkName) : entry;
  });
}

/**
 * Fills the twelve roles of a semantic palette by reference to a hue palette.
 *
 * @remarks
 *   The reference resolves to the hue's custom property, and the hue palette defines both modes,
 *   so `primary: paletteAlias("teal")` is a whole remap in one line.
 * @param hue - The hue palette every role points at.
 */
export function paletteAlias(hue: string): SemanticPalette {
  return roles((role) => referenced(`${hue}.${role}`));
}

/**
 * Points the neutral palette's quiet fills at the page's own surfaces, so a grey button and the
 * panel behind it are drawn from one place.
 */
export function neutralFills(): Pick<SemanticPalette, "emphasized" | "muted" | "subtle"> {
  return {
    emphasized: referenced("bg.emphasized"),
    muted: referenced("bg.muted"),
    subtle: referenced("bg.subtle"),
  };
}
