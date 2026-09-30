/**
 * Declares the sortable kit's slot recipe: rows a person drags into another order, in one list or
 * in the lists of a board.
 *
 * @remarks
 *   A row is a panel card with a hairline edge, its handle at the start and the caller's content
 *   after it, where a row's content part takes the rest of the row. A fixed row keeps an empty box
 *   of the handle's size, so its content starts where the other rows' does. The row a person drags
 *   is dnd-kit's own element in the top layer, raised by the large shadow. The place it will take
 *   is dnd-kit's placeholder, a copy of the row the recipe renders as a dashed slot with its
 *   content hidden. A list takes at least one control's height, so an empty list is a place to drop
 *   on. A board lays its lists out in a row, each list a well from 15rem to 20rem wide that shares
 *   the board's width, and the row scrolls sideways once the lists are wider than the board. A list
 *   that refuses the dragged row dashes its edge in the error ink and dims its rows to the muted
 *   opacity.
 */

import { defineSlotRecipe, dense, surface } from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, which a selector across parts reads.
 */
const CLASS = "sortable";

/**
 * Styles the kit's rows, lists and board.
 */
export const recipe = defineSlotRecipe({
  base: {
    board: { minInlineSize: "0" },
    empty: {
      color: "fg.muted",
      paddingBlock: dense("{spacing.inset.sm}"),
      paddingInline: dense("{spacing.inset.xs}"),
      textAlign: "center",
      textStyle: "body.sm",
    },
    fixed: {
      blockSize: dense("{sizes.control.xs}"),
      flexShrink: "0",
      inlineSize: dense("{sizes.control.xs}"),
    },
    handle: { cursor: "drag", flexShrink: "0", touchAction: "none" },
    item: {
      ...surface("xs"),
      "&[data-dnd-dragging]": { boxShadow: "lg", cursor: "dragging" },
      "&[data-dnd-placeholder]": {
        "& > *": { visibility: "hidden" },
        background: "transparent",
        borderColor: "border.emphasized",
        borderStyle: "dashed",
        boxShadow: "none",
      },
      alignItems: "center",
      display: "flex",
      gap: dense("{spacing.gap.sm}"),
      minInlineSize: "0",
      paddingBlock: dense("{spacing.inset.xs}"),
      paddingInlineEnd: dense("{spacing.inset.sm}"),
      paddingInlineStart: dense("{spacing.inset.xs}"),
      textStyle: "body.sm",
    },
    itemContent: {
      alignItems: "center",
      display: "flex",
      flex: "1",
      gap: dense("{spacing.gap.sm}"),
      minInlineSize: "0",
    },
    items: {
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.xs}"),
      listStyle: "none",
      margin: "0",
      minBlockSize: dense("{sizes.control.md}"),
      padding: "0",
    },
    lanes: { alignItems: "flex-start", display: "flex", gap: dense("{spacing.gap.md}") },
    list: {
      "&[data-refuses]": {
        [`& .${CLASS}__item`]: { opacity: "muted" },
        borderColor: "border.error",
        borderStyle: "dashed",
      },
      background: "bg.subtle",
      borderColor: "transparent",
      borderRadius: "l2",
      borderWidth: "hairline",
      display: "flex",
      flexBasis: "{sizes.60}",
      flexDirection: "column",
      flexGrow: "1",
      flexShrink: "0",
      gap: dense("{spacing.gap.sm}"),
      maxInlineSize: "xs",
      minInlineSize: "{sizes.60}",
      padding: dense("{spacing.inset.sm}"),
    },
    root: { minInlineSize: "0" },
  },
  className: CLASS,
  jsx: [/^Sortable\.\w+$/u],
  slots: [
    "root",
    "board",
    "lanes",
    "list",
    "items",
    "item",
    "handle",
    "fixed",
    "itemContent",
    "empty",
  ],
});
