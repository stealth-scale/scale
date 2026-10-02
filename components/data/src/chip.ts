/**
 * Computes the size styles the tag and the badge share.
 *
 * @remarks
 *   Both take their height from the tag scale, and their inline padding and the gap between their
 *   parts from the gap scale, which is tighter than the inset scale at those heights. The label is
 *   one size smaller than the chip.
 */

import { below, dense, type SystemStyleObject } from "@stealthscale/theme/authoring";

/**
 * Size of a chip.
 */
export type ChipSize = "lg" | "md" | "sm" | "xl";

/**
 * Sizes a chip offers, smallest first.
 */
export const CHIP_SIZES: readonly ChipSize[] = ["sm", "md", "lg", "xl"];

/**
 * Maps each size to the gap token of the inline padding: 6, 8, 8 and 12px at the foundation's
 * metrics.
 */
const PAD: Readonly<Record<ChipSize, string>> = { lg: "md", md: "md", sm: "sm", xl: "lg" };

/**
 * Maps each size to the gap token between a mark and the label: 4, 4, 6 and 6px.
 */
const GAP: Readonly<Record<ChipSize, string>> = { lg: "sm", md: "xs", sm: "xs", xl: "sm" };

/**
 * Returns the height, inline padding, gap and text style of a chip at one size.
 */
export function chipSize(size: ChipSize): SystemStyleObject {
  return {
    gap: dense(`{spacing.gap.${GAP[size]}}`),
    height: dense(`{sizes.tag.${size}}`),
    paddingInline: dense(`{spacing.gap.${PAD[size]}}`),
    textStyle: `label.${below(size)}`,
  };
}
