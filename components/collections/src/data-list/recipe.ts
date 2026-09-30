/**
 * Declares the data list's slot recipe: pairs of a label and a value, down the list or across it.
 *
 * @remarks
 *   The root is a description list. Each item is a `div` that contains one term and its detail,
 *   which HTML allows inside `dl`. Down the list, the label is above its value. Across it, the root
 *   is a grid of two columns and each item is a subgrid row, so every value starts at the same
 *   inline position: the widest label's width, capped at 40% of the list. The value wraps at any
 *   character, so a long identifier never widens the list. The root sets the gap between items as
 *   `--data-list-gap`, which a divided list also pads each rule by. The list has no color and no
 *   box of its own, so it offers no `palette` and no `effect` axis.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Custom property the root sets to the gap between items, which a divided list pads each rule by.
 */
export const GAP = "--data-list-gap";

/**
 * Class name of the recipe, which a selector across parts reads.
 */
const CLASS = "data-list";

/**
 * Maps each size to the gap between items and to the gap between the columns across the list.
 *
 * @remarks
 *   The gaps measure 8, 12 and 16px between items, and 12, 16 and 24px between the columns, at the
 *   foundation's metrics.
 */
const GAPS: Readonly<Record<"lg" | "md" | "sm", readonly [items: string, columns: string]>> = {
  lg: ["xl", "2xl"],
  md: ["lg", "xl"],
  sm: ["md", "lg"],
};

/**
 * Styles a data list down the page at the middle size, with a muted label.
 */
export const recipe = defineSlotRecipe({
  base: {
    item: { minInlineSize: "0" },
    itemLabel: {
      alignItems: "center",
      display: "flex",
      gap: "0.375em",
      minInlineSize: "0",
    },
    itemValue: {
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      gap: "0.375em",
      margin: "0",
      minInlineSize: "0",
      overflowWrap: "anywhere",
    },
    root: { margin: "0", minInlineSize: "0" },
  },
  className: CLASS,
  defaultVariants: { orientation: "vertical", size: "md", variant: "subtle" },
  jsx: [/^DataList\.\w+$/u],
  slots: ["root", "item", "itemLabel", "itemValue"],
  variants: {
    /**
     * Whether a hairline separates each item from the one before it.
     *
     * @remarks
     *   The rule is as far from the item above it as from the item below it: the root's gap above
     *   and the same gap as padding below.
     */
    divided: {
      true: {
        item: {
          [`& + .${CLASS}__item`]: {
            borderBlockStartWidth: "hairline",
            borderColor: "border",
            paddingBlockStart: `var(${GAP})`,
          },
        },
      },
    },

    /**
     * Which way a label and its value run: the label above the value, or beside it.
     */
    orientation: {
      horizontal: {
        item: {
          alignItems: "baseline",
          display: "grid",
          gridColumn: "1 / -1",
          gridTemplateColumns: "subgrid",
        },
        root: {
          display: "grid",
          gridTemplateColumns: "fit-content(40%) minmax(0, 1fr)",
          rowGap: `var(${GAP})`,
        },
      },
      vertical: {
        item: { display: "flex", flexDirection: "column", gap: dense("{spacing.gap.xs}") },
        root: { display: "flex", flexDirection: "column", gap: `var(${GAP})` },
      },
    },

    /**
     * The text style of the items, one size smaller than the list, and the gaps between them.
     */
    size: onSlots({
      item: sizeVariants((size) => ({ textStyle: `body.${below(size)}` }), ["sm", "md", "lg"]),
      root: sizeVariants(
        (size) => ({
          columnGap: dense(`{spacing.gap.${GAPS[size][1]}}`),
          [GAP]: dense(`{spacing.gap.${GAPS[size][0]}}`),
        }),
        ["sm", "md", "lg"],
      ),
    }),

    /**
     * Which of the pair is louder.
     *
     * @remarks
     *   `subtle` mutes the label, so the value reads first, as in a summary. `bold` sets the label
     *   in the label weight and mutes the value, as in a form of settled answers.
     */
    variant: {
      bold: {
        itemLabel: { fontWeight: "medium" },
        itemValue: { color: "fg.muted" },
      },
      subtle: { itemLabel: { color: "fg.muted" } },
    },
  },
});
