/**
 * Draws the type scale: the sizes, the line height and tracking each one is read at, the roles
 * over them, and the steps each text role offers.
 */

import { type Roles, roles } from "#draw/roles.ts";
import { type TextStyles, type Tokens } from "#pandacss.ts";

/**
 * Selects one of the eight steps a scale of sizes offers.
 */
export type Scale = "2xl" | "3xl" | "4xl" | "lg" | "md" | "sm" | "xl" | "xs";

/**
 * Selects one of the roles a component's words are read at.
 */
export type TextRole = "body" | "code" | "display" | "heading" | "label";

/**
 * Lists the steps each role offers, which is what a component's `size` axis reads.
 *
 * @remarks
 *   A role states the steps it has here and the styles it draws them in beside its own
 *   definition, and a specification holds the two to each other. A component reads this list
 *   rather than restating one, so a role that gains a step reaches every component that reads it.
 */
export const ROLE_SIZES = {
  body: ["xs", "sm", "md", "lg", "xl"],
  code: ["sm", "md"],
  display: ["sm", "md", "lg"],
  heading: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"],
  label: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"],
} as const satisfies Record<TextRole, readonly Scale[]>;

/**
 * Describes the sizes a theme states.
 */
type Sizes = NonNullable<Tokens["fontSizes"]>;

/**
 * Describes what a theme states about its type scale and the roles over it.
 */
export interface Type extends Roles {
  /**
   * The body size, in rem. One unless stated.
   */
  base?: number | undefined;

  /**
   * The step between rungs of the scale. A major second, 1.125, unless stated.
   */
  ratio?: number | undefined;
}

/**
 * Describes the type scale as drawn: the size tokens, and the size styles and the roles over them.
 */
export interface TypeScale {
  /**
   * The size of each rung, `2xs` to `9xl`, under `tokens.fontSizes`.
   */
  fontSizes: Sizes;

  /**
   * Each rung as a text style with the leading and tracking it is read at, and the roles a
   * recipe names instead of a rung.
   */
  textStyles: TextStyles;
}

/**
 * Places each step on the scale, counted in rungs from the body size.
 *
 * @remarks
 *   The display sizes climb faster than the ratio would take them, because a heading three rungs
 *   above the body reads as emphasis rather than as a heading. The top two steps carry a hero,
 *   where the words are the page and a size the paragraph could reach is not loud enough.
 */
const STEPS: ReadonlyArray<readonly [name: string, rungs: number]> = [
  ["2xs", -3],
  ["xs", -2],
  ["sm", -1],
  ["md", 0],
  ["lg", 1],
  ["xl", 2],
  ["2xl", 3],
  ["3xl", 4.5],
  ["4xl", 6],
  ["5xl", 8],
  ["6xl", 10],
  ["7xl", 12],
  ["8xl", 14],
  ["9xl", 16],
];

/**
 * Sets the line height by size: small text needs the room, and large text is crowded by it.
 */
const LEADING: ReadonlyArray<readonly [ceiling: number, height: number]> = [
  [1.25, 1.5],
  [2, 1.35],
  [3, 1.2],
];

/**
 * Fixes the line height a display size is set at, once the table above runs out.
 */
const TIGHTEST = 1.1;

/**
 * Fixes the body size and the ratio the foundation draws its scale at.
 */
const DEFAULTS = { base: 1, ratio: 1.125 };

/**
 * Describes one step of the scale once placed.
 */
interface Step {
  /**
   * The step's name, `2xs` to `9xl`.
   */
  name: string;

  /**
   * The size, in rem.
   */
  rem: number;
}

/**
 * Places every step of the scale once.
 *
 * @param base - The body size, in rem.
 * @param ratio - The step between rungs.
 */
function steps(base: number, ratio: number): readonly Step[] {
  return STEPS.map(([name, rungs]) => ({ name, rem: base * ratio ** rungs }));
}

/**
 * Reads the line height for a size.
 */
function lineHeightFor(rem: number): number {
  return LEADING.find(([ceiling]) => rem <= ceiling)?.[1] ?? TIGHTEST;
}

/**
 * Reads the tracking for a size, which tightens as the size grows.
 */
function letterSpacingFor(rem: number): string {
  if (rem >= 2) return "-0.02em";
  if (rem >= 1.25) return "-0.01em";

  return "0em";
}

/**
 * Draws the sizes alone, keyed `2xs` to `9xl`, for a recipe that sets one without the leading that
 * goes with it.
 *
 * @param base - The body size, in rem.
 * @param ratio - The step between rungs.
 */
export function fontSizes(base = DEFAULTS.base, ratio = DEFAULTS.ratio): Sizes {
  return Object.fromEntries(
    steps(base, ratio).map(({ name, rem }) => [name, { value: `${rem.toFixed(4)}rem` }]),
  );
}

/**
 * Draws the text styles, keyed `2xs` to `9xl`: each size by the name of its token, with the
 * leading and tracking it is read at.
 *
 * @remarks
 *   A recipe states `textStyle` rather than `fontSize`, so the three move together. The size is a
 *   reference to the `fontSizes` token of the same name, and the leading and the tracking are
 *   computed from the rems the same arguments produce.
 * @param base - The body size, in rem.
 * @param ratio - The step between rungs.
 */
export function typography(base = DEFAULTS.base, ratio = DEFAULTS.ratio): TextStyles {
  return Object.fromEntries(
    steps(base, ratio).map(({ name, rem }) => [
      name,
      {
        value: {
          fontSize: name,
          letterSpacing: letterSpacingFor(rem),
          lineHeight: String(lineHeightFor(rem)),
        },
      },
    ]),
  );
}

/**
 * Draws the type scale a theme states: the size tokens and the size styles from one base and one
 * ratio, and the roles over them with what the theme states about each.
 *
 * @param type - The body size, the ratio and the roles, each the foundation's unless stated.
 */
export function typeScale(type: Type = {}): TypeScale {
  const base = type.base ?? DEFAULTS.base;
  const ratio = type.ratio ?? DEFAULTS.ratio;

  return {
    fontSizes: fontSizes(base, ratio),
    textStyles: { ...typography(base, ratio), ...roles(type) },
  };
}
