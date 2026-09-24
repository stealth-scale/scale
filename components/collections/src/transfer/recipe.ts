/**
 * Recipe for the transfer: two lists side by side and the column of controls between them.
 *
 * @remarks
 *   Both sides take an equal share of the width, so the pair keeps its layout as rows move. Both
 *   take the height of the taller side, with a floor of every row's height, which the side reads
 *   from the list's `--listbox-row` and its own `--transfer-rows`, so an empty side is as tall as a
 *   full one. The controls centre on the pair's height. A control's square and its mark are each
 *   one size smaller than the transfer, on the control scale and the icon scale. The palette is
 *   set on the root, and both lists inherit it. The recipe has no `effect` axis, because a pick in
 *   a transfer lasts until the next press of a control, and the checkbox marks it.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  interactive,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
} from "@stealthscale/theme/authoring";

import { ROW_HEIGHT } from "#listbox/recipe.ts";

/**
 * Sizes the transfer offers.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Class name of the listbox recipe, whose frame and content a side sizes.
 */
export const LISTBOX = "listbox";

/**
 * Custom property a side sets to the number of rows it keeps room for.
 */
export const ROWS = "--transfer-rows";

/**
 * Defines the transfer recipe at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: {
      ...interactive(),
      _disabled: { layerStyle: "disabled" },
      alignItems: "center",
      borderColor: "border",
      borderRadius: "l2",
      borderStyle: "solid",
      borderWidth: "hairline",
      color: "fg.muted",
      display: "inline-flex",
      justifyContent: "center",
    },
    controls: {
      alignItems: "center",
      alignSelf: "center",
      display: "flex",
      flexDirection: "column",
      flexShrink: "0",
    },
    root: { alignItems: "stretch", display: "flex", minInlineSize: "0" },
    side: {
      [`& .${LISTBOX}__content`]: {
        flex: "1",
        minBlockSize: `calc(var(${ROW_HEIGHT}) * var(${ROWS}))`,
      },
      [`& .${LISTBOX}__frame`]: { flex: "1" },
      display: "grid",
      flex: "1",
      minInlineSize: "0",
    },
  },
  className: "transfer",
  defaultVariants: { size: "md" },
  jsx: [/^Transfer(\.\w+)?$/u],
  slots: ["root", "side", "controls", "control"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Palette the lists' checkboxes and fills read.
     *
     * @remarks
     *   The palette is set on the root, and both lists inherit its custom properties.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Gap between the parts and the size of the controls and their marks.
     */
    size: onSlots({
      control: sizeVariants(
        (size) => ({
          "& > *": { boxSize: dense(`{sizes.icon.${below(size)}}`) },
          boxSize: dense(`{sizes.control.${below(size)}}`),
        }),
        SIZES,
      ),
      controls: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), SIZES),
    }),
  },
});
