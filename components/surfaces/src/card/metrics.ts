/**
 * Computes the geometry the card's size axis and bleeding bands are written from.
 *
 * @remarks
 *   The root publishes its inset and its gap as custom properties at every size. `Media` and
 *   `Section` read them back, so a band bleeds to the card's edge and spaces its rules at any size
 *   and density without one compound per size. The module is separate from the recipe so the recipe
 *   is under the 300-line limit.
 */

import { below, dense, type SystemStyleObject } from "@stealthscale/theme/authoring";

/**
 * Selects one of the four sizes a card offers.
 */
export type Step = "lg" | "md" | "sm" | "xl";

/**
 * Lists the sizes the card is styled at, smallest first.
 */
export const STEPS: readonly Step[] = ["sm", "md", "lg", "xl"];

/**
 * Class name of the recipe, which selectors across parts are built from.
 */
export const CLASS = "card";

/**
 * Custom property on the root that contains the root's inset.
 */
export const INSET = "--card-inset";

/**
 * Custom property on the root that contains the gap between two bands.
 */
export const GAP = "--card-gap";

/**
 * Negative margin that cancels the root's inset.
 */
export const BLEED = `calc(-1 * var(${INSET}))`;

/**
 * Border colour and style of a rule between two bands.
 */
export const RULE = { borderColor: "border", borderStyle: "solid" };

/**
 * Maps each size to the size token of an image in the indicator: 32, 40, 48 and 56px.
 */
const AVATAR: Readonly<Record<Step, string>> = { lg: "12", md: "10", sm: "8", xl: "14" };

/**
 * Maps each size to the gap token between the header's text and the indicator or the aside: 8,
 * 12, 16 and 16px.
 */
const FLANK: Readonly<Record<Step, string>> = { lg: "xl", md: "lg", sm: "md", xl: "xl" };

/**
 * Returns the root's inset and gap at a size, published as custom properties and applied as the
 * root's padding and gap.
 *
 * @remarks
 *   The properties contain the density-scaled lengths, so a band that bleeds by the inset ends at
 *   the edge under any density.
 * @param size - The card's size.
 * @returns The root's size styles.
 */
export function spaced(size: Step): SystemStyleObject {
  return {
    [GAP]: dense(`{spacing.gap.${size}}`),
    gap: `var(${GAP})`,
    [INSET]: dense(`{spacing.inset.${size}}`),
    padding: `var(${INSET})`,
  };
}

/**
 * Returns the title's text style: the heading one size smaller than the card, or `label.lg` at
 * `sm`.
 *
 * @remarks
 *   One size smaller than `heading.sm` is body text, so the smallest card takes the largest label
 *   instead.
 * @param size - The card's size.
 * @returns The title's styles.
 */
export function titled(size: Step): SystemStyleObject {
  return { textStyle: size === "sm" ? "label.lg" : `heading.${below(size)}` };
}

/**
 * Returns the indicator's styles at a size: the gap to the title, and the size of an image or an
 * icon inside it.
 *
 * @remarks
 *   An image anywhere in the indicator is a round avatar of 32 to 56px, so a skeleton around it
 *   keeps its size. An icon placed directly in the indicator takes the icon size of the card's
 *   size. The gap is a margin on the indicator rather than a column gap on the header, so a header
 *   without an indicator starts its title at the inset.
 * @param size - The card's size.
 * @returns The indicator's styles.
 */
export function marked(size: Step): SystemStyleObject {
  return {
    "& > svg": { boxSize: dense(`{sizes.icon.${size}}`) },
    "& img": {
      borderRadius: "full",
      boxSize: dense(`{sizes.${AVATAR[size]}}`),
      objectFit: "cover",
    },
    marginInlineEnd: dense(`{spacing.gap.${FLANK[size]}}`),
  };
}

/**
 * Returns the aside's start margin at a size, the gap between the header's text and the aside.
 *
 * @param size - The card's size.
 * @returns The aside's styles.
 */
export function asided(size: Step): SystemStyleObject {
  return { marginInlineStart: dense(`{spacing.gap.${FLANK[size]}}`) };
}

/**
 * Returns the styles that bleed a band of a vertical card to the card's edges.
 *
 * @remarks
 *   The band always extends to both inline edges. It extends to the top edge only as the root's
 *   first child and to the bottom edge only as its last child, so a band between two others keeps
 *   the gap above and below it.
 * @returns The band's styles.
 */
export function bled(): SystemStyleObject {
  return {
    "&:first-child": { marginBlockStart: BLEED },
    "&:last-child": { marginBlockEnd: BLEED },
    marginInline: BLEED,
  };
}

/**
 * Returns the styles of a band that renders the rule above it: a hairline across the card's full
 * width with the inset on both sides.
 *
 * @remarks
 *   The band extends to both side edges and pads its content back to the inset. The space above
 *   the rule is the root's gap plus a margin of the inset less the gap, and the space below it is
 *   the inset as padding. Every rule in a card is rendered by the lower band of its boundary, so no
 *   boundary has two rules.
 * @returns The band's styles.
 */
export function ruled(): SystemStyleObject {
  const inset = `var(${INSET})`;

  return {
    ...RULE,
    borderBlockStartWidth: "hairline",
    marginBlockStart: `calc(${inset} - var(${GAP}))`,
    marginInline: BLEED,
    paddingBlockStart: inset,
    paddingInline: inset,
  };
}

/**
 * Returns the styles of a section, a band that bleeds to the card's side edges with its content at
 * the inset.
 *
 * @remarks
 *   A section renders the rule above it unless it is the first band or follows the picture. As the
 *   first band it extends to the top edge, and as the last band to the bottom edge, with the inset
 *   as padding. The band after a section renders the rule below it, through {@link ruled}.
 * @returns The section's styles.
 */
export function sectioned(): SystemStyleObject {
  const inset = `var(${INSET})`;

  return {
    "&:first-child": { marginBlockStart: BLEED, paddingBlockStart: inset },
    "&:last-child": { marginBlockEnd: BLEED, paddingBlockEnd: inset },
    [`&:not(:first-child, .${CLASS}__media + *)`]: ruled(),
    marginInline: BLEED,
    paddingInline: inset,
  };
}
