/**
 * Recipe for the pagination: a row of page buttons between the buttons that move a page back and
 * forward, the marks between distant pages, and the text that states the current page.
 *
 * @remarks
 *   Every page and every trigger is the actions package's square `Button`, at the pagination's size
 *   and in the look and palette the root passes it. The current page is the button with
 *   `aria-current="page"`, which the button's looks mark as on. The recipe lays the row out, sizes
 *   the gaps, the ellipsis and the page text, and sets the page numbers in figures of one width.
 *   While the root marks the row `data-crowded`, the pages and the marks are hidden and the summary
 *   in their place states the current page. The recipe has no palette or effect axis of its own,
 *   because the buttons take the palette from the root.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the recipe offers, the sizes it passes to the buttons.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Selects a page, a mark or the summary inside a root whose pages do not fit its row.
 */
const CROWDED = "[data-crowded] > &";

/**
 * Sets text that states the current page in muted figures of one width, on one line.
 */
const STATED = { color: "fg.muted", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" };

/**
 * Pads text that states the current page and sets its type, per size.
 */
const STATED_SIZES = sizeVariants(
  (size) => ({ paddingInline: dense(`{spacing.gap.${size}}`), textStyle: `label.${size}` }),
  SIZES,
);

/**
 * Defines the pagination recipe, at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    ellipsis: {
      alignItems: "center",
      color: "fg.muted",
      [CROWDED]: { display: "none" },
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      userSelect: "none",
    },
    item: { [CROWDED]: { display: "none" }, fontVariantNumeric: "tabular-nums" },
    pageText: STATED,
    root: { alignItems: "center", display: "flex", minInlineSize: "0" },
    summary: { ...STATED, [CROWDED]: { display: "block" }, display: "none" },
  },
  className: "pagination",
  defaultVariants: { size: "md" },
  jsx: [/^Pagination(\.\w+)?$/u],
  slots: ["root", "item", "ellipsis", "summary", "trigger", "pageText"],
  variants: {
    /**
     * Size of the gaps, the ellipsis, the summary and the page text, beside the buttons' own size.
     *
     * @remarks
     *   The gap between buttons is one step below the size, so a row of squares reads as one group.
     *   The ellipsis is a square of the control's side, so the row keeps one rhythm.
     */
    size: onSlots({
      ellipsis: sizeVariants(
        (size) => ({ boxSize: dense(`{sizes.control.${size}}`), textStyle: `label.${size}` }),
        SIZES,
      ),
      pageText: STATED_SIZES,
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
      summary: STATED_SIZES,
    }),
  },
});
