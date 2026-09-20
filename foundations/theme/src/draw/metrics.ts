/**
 * Draws the semantic sizes and spacing a recipe reads: five scales of eight steps from one base
 * each, and the widths and measures a layout is built from.
 *
 * @remarks
 *   A recipe writes `height: "control.md"` and `paddingInline: "inset.md"` rather than a step of
 *   the spacing grid, so a theme moves the layout by restating one density scale rather than
 *   editing every recipe. Every step of the five scales is also multiplied by the `--density`
 *   property, which a page sets on any element with `data-density`, so a subtree goes compact or
 *   comfortable inside any theme and the two densities compose rather than one replacing the
 *   other. The three steps above `xl` are for a hero: a call to action, the mark beside it and the
 *   room around it grow together on the same names. The layout widths, the measure, the marker
 *   gutter and the safe area scale with neither density.
 */

import { type Scale } from "#draw/type.ts";
import { type SemanticTokens } from "#pandacss.ts";
import { compact, recordOf } from "#record.ts";

/**
 * Lists the eight steps in the order they grow, which is the order a recipe offers them in and a
 * README reads them in.
 */
export const SCALE: readonly Scale[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];

/**
 * Fixes the property every scaled step is multiplied by at run time, which a page sets with the
 * density attribute.
 */
export const DENSITY = "--density";

/**
 * Fixes what the property is set to under each density attribute.
 */
export const DENSITIES: Readonly<Record<"comfortable" | "compact", number>> = {
  comfortable: 1.1,
  compact: 0.9,
};

/**
 * Selects one of the twelve measures a page and its columns are read at.
 */
export type Width =
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "lg"
  | "md"
  | "sm"
  | "xl"
  | "xs";

/**
 * Lists the measures in the order they grow.
 */
export const WIDTHS: readonly Width[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
];

/**
 * Describes one scale of eight, as the compiler reads it.
 */
type Steps = Record<Scale, Record<"value", string>>;

/**
 * Describes a category of semantic sizes or spacing.
 */
type Sized = NonNullable<SemanticTokens["sizes"]>;

/**
 * Describes what a theme states about its metrics.
 */
export interface Metrics {
  /**
   * The width of the secondary panel. Twenty rem unless stated.
   */
  aside?: string | undefined;

  /**
   * The height of a medium control, in rem, before the density scale. Two and a half unless
   * stated.
   */
  control?: number | undefined;

  /**
   * The gap inside a medium control, in rem, before the density scale. A half unless stated.
   */
  gap?: number | undefined;

  /**
   * The box of a medium icon, in rem, before the density scale. One and a quarter unless stated.
   */
  icon?: number | undefined;

  /**
   * The padding of a medium control, in rem, before the density scale. One unless stated.
   */
  inset?: number | undefined;

  /**
   * The measure a narrow page is read at. Forty-eight rem unless stated.
   */
  narrow?: string | undefined;

  /**
   * The measure body text is read at, in characters. Sixty-five unless stated.
   */
  prose?: string | undefined;

  /**
   * The width a panel collapses to. Four rem unless stated.
   */
  rail?: string | undefined;

  /**
   * The density: what every control, icon, tag, inset and gap is multiplied by. One unless
   * stated.
   */
  scale?: number | undefined;

  /**
   * The width of the navigation panel. Sixteen rem unless stated.
   */
  sidebar?: string | undefined;

  /**
   * The height of a medium tag, in rem, before the density scale. One and a half unless stated.
   */
  tag?: number | undefined;

  /**
   * The measure a wide page is read at. Eighty rem unless stated.
   */
  wide?: string | undefined;
}

/**
 * Describes the metrics as drawn: the two categories a theme spreads into its semantic tokens.
 */
export interface Drawn {
  /**
   * The control, icon and tag scales, the measure, the layout widths and the page measures.
   */
  sizes: Sized;

  /**
   * The gap and inset scales, the marker gutter and the safe area.
   */
  spacing: Sized;
}

/**
 * Fixes every base the foundation draws its metrics at.
 */
const DEFAULTS = {
  aside: "20rem",
  control: 2.5,
  gap: 0.5,
  icon: 1.25,
  inset: 1,
  narrow: "48rem",
  prose: "65ch",
  rail: "4rem",
  scale: 1,
  sidebar: "16rem",
  tag: 1.5,
  wide: "80rem",
};

/**
 * Places each step as a share of the base, for a control's height and a tag's.
 */
const CONTROLS: Readonly<Record<Scale, number>> = {
  "2xl": 1.4,
  "3xl": 1.6,
  "4xl": 2,
  lg: 1.1,
  md: 1,
  sm: 0.9,
  xl: 1.2,
  xs: 0.8,
};

/**
 * Places each step as a share of the base, for an icon's box.
 */
const ICONS: Readonly<Record<Scale, number>> = {
  "2xl": 2,
  "3xl": 2.5,
  "4xl": 3,
  lg: 1.2,
  md: 1,
  sm: 0.8,
  xl: 1.6,
  xs: 0.6,
};

/**
 * Places each step as a share of the base, for the padding inside a control.
 */
const INSETS: Readonly<Record<Scale, number>> = {
  "2xl": 2,
  "3xl": 2.5,
  "4xl": 3,
  lg: 1.25,
  md: 1,
  sm: 0.75,
  xl: 1.5,
  xs: 0.5,
};

/**
 * Places each step as a share of the base, for the gap between things.
 */
const GAPS: Readonly<Record<Scale, number>> = {
  "2xl": 3,
  "3xl": 4,
  "4xl": 6,
  lg: 1.5,
  md: 1,
  sm: 0.75,
  xl: 2,
  xs: 0.5,
};

/**
 * Writes one step of a scale in rem.
 *
 * @remarks
 *   The run-time density is not written here. A custom property inherits the value it computed
 *   where it was declared, after every `var()` in it was substituted, so a token carrying
 *   `var(--density)` is fixed at the density of the element that declared it and a subtree that
 *   sets another density inherits the same length. The multiplier belongs where the step is
 *   consumed, which is {@link dense} in the recipe helpers.
 */
function step(base: number, share: number): Record<"value", string> {
  return { value: `${(base * share).toFixed(4)}rem` };
}

/**
 * Draws eight steps from a base in rem.
 */
function scaled(base: number, shares: Readonly<Record<Scale, number>>): Steps {
  return recordOf(SCALE, (size) => step(base, shares[size]));
}

/**
 * Draws the heights of a control, keyed `xs` to `4xl`.
 *
 * @param base - The height of a medium control, in rem.
 */
export function controls(base = DEFAULTS.control): Sized {
  return scaled(base, CONTROLS);
}

/**
 * Draws the boxes of an icon, keyed `xs` to `4xl`.
 *
 * @param base - The box of a medium icon, in rem.
 */
export function icons(base = DEFAULTS.icon): Sized {
  return scaled(base, ICONS);
}

/**
 * Draws the heights of a tag, keyed `xs` to `4xl`.
 *
 * @remarks
 *   A tag is a badge, a chip or a pill: something read beside a control rather than pressed, and
 *   drawn shorter than one. It grows on the control's own shares, so a theme that stretches its
 *   controls stretches the tags beside them by the same amount and the two keep their proportion.
 * @param base - The height of a medium tag, in rem.
 */
export function tags(base = DEFAULTS.tag): Sized {
  return scaled(base, CONTROLS);
}

/**
 * Draws the padding inside a control, keyed `xs` to `4xl`.
 *
 * @param base - The padding of a medium control, in rem.
 */
export function insets(base = DEFAULTS.inset): Sized {
  return scaled(base, INSETS);
}

/**
 * Draws the gaps between things, keyed `xs` to `4xl`.
 *
 * @param base - The gap inside a medium control, in rem.
 */
export function gaps(base = DEFAULTS.gap): Sized {
  return scaled(base, GAPS);
}

/**
 * Draws the metrics a theme states: every semantic size and spacing, with the five scales
 * multiplied by the density.
 *
 * @remarks
 *   The safe area is the one spacing here a theme does not decide. A phone keeps room at an edge
 *   for a home indicator, a notch or a rounded corner, and the browser is the only thing that knows
 *   how much. Anything a page fixes to an edge reads these rather than writing `env()`, which a
 *   recipe may not do, and reads zero on every device that reserves nothing. The marker gutter is
 *   in ems, because a browser draws a marker in the entry's own type size. The reading measure is
 *   in characters rather than in rems, because the line a reader follows without losing their
 *   place is counted in characters and not in length.
 * @param stated - The density and the bases, each the foundation's unless stated.
 */
export function metrics(stated: Metrics = {}): Drawn {
  const { aside, control, gap, icon, inset, narrow, prose, rail, scale, sidebar, tag, wide } = {
    ...DEFAULTS,
    ...compact(stated),
  };

  return {
    sizes: {
      aside: { value: aside },
      control: controls(control * scale),
      icon: icons(icon * scale),
      page: { narrow: { value: narrow }, wide: { value: wide } },
      prose: { value: prose },
      rail: { value: rail },
      sidebar: { value: sidebar },
      tag: tags(tag * scale),
    },
    spacing: {
      gap: gaps(gap * scale),
      inset: insets(inset * scale),
      marker: { value: "2.5em" },
      safe: {
        bottom: { value: "env(safe-area-inset-bottom, 0px)" },
        left: { value: "env(safe-area-inset-left, 0px)" },
        right: { value: "env(safe-area-inset-right, 0px)" },
        top: { value: "env(safe-area-inset-top, 0px)" },
      },
    },
  };
}
