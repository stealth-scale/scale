/**
 * Recipe for the command palette: a raised panel with a query bar above a scrolling list.
 *
 * @remarks
 *   The rows are the listbox's, and the listbox recipe styles them. The root passes its size to the
 *   listbox, so the rows follow the palette's size. The field has no edge and no focus ring of its
 *   own: the panel is the edge, and the caret and the highlighted row show where the keys go. The
 *   clear control is an unfilled mark at the bar's end. The rule under the bar is the only rule
 *   between the bar and the rows. The listbox's control is the bar's only `div` child: the bar
 *   removes its rule and lets it take the width the glyph and the clear control leave. The rows
 *   scroll in the listbox's scroll area. The list pads the block ends of the listbox's rows one gap
 *   step below the palette's size beyond the listbox's own padding, and adds no inline padding,
 *   because the listbox insets its rows. The panel sets the palette, which the highlighted row
 *   reads. The recipe has no `effect` axis, because the palette is a panel and its highlight moves
 *   with the arrow keys.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  divider,
  interactive,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  type Scale,
  sizeVariants,
  surface,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the palette offers, typed as literals so the root's `size` fits the listbox's.
 */
const SIZES = ["sm", "md", "lg"] as const satisfies readonly Scale[];

/**
 * Class name of the listbox recipe, whose rows the list pads.
 */
export const LISTBOX = "listbox";

/**
 * Padding the listbox's rows take on every side.
 */
const ROWS_PAD = "{spacing.gap.xs}";

/**
 * Defines the command recipe over its eight slots: size `md` in the neutral palette by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    clear: {
      ...interactive(),
      _hover: { color: "fg" },
      alignItems: "center",
      appearance: "none",
      background: "transparent",
      borderStyle: "none",
      color: "fg.muted",
      cursor: "button",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      padding: "0",
    },
    control: {
      ...divider("horizontal"),
      "& > div": { borderBlockEndWidth: "0", flex: "1", minInlineSize: "0" },
      alignItems: "center",
      display: "flex",
      flexShrink: "0",
    },
    empty: { color: "fg.muted", textAlign: "center" },
    indicator: { alignItems: "center", color: "fg.muted", display: "inline-flex", flexShrink: "0" },
    input: {
      appearance: "none",
      background: "transparent",
      borderStyle: "none",
      color: "fg",
      flex: "1",
      minInlineSize: "0",
      outline: "none",
    },
    list: { display: "flex", flexDirection: "column", minBlockSize: "0" },
    root: { ...surface("lg"), display: "flex", flexDirection: "column", overflow: "clip" },
    shortcut: {
      ...truncate(),
      borderColor: "border",
      borderWidth: "hairline",
      color: "fg.muted",
      flexShrink: "0",
      marginInlineStart: "auto",
    },
  },
  className: "command",
  defaultVariants: { palette: "neutral", size: "md" },
  jsx: [/^Command(\.\w+)?$/u],
  slots: ["root", "control", "indicator", "input", "clear", "list", "empty", "shortcut"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Palette of the highlighted row, set on the panel.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Size of the bar, its glyph and clear control, the padding of the listbox's rows, the empty
     * message and the shortcuts.
     */
    size: onSlots({
      clear: sizeVariants((size) => ({ boxSize: dense(`{sizes.icon.${size}}`) }), SIZES),
      control: sizeVariants(
        (size) => ({
          blockSize: dense(`{sizes.control.${size}}`),
          gap: dense(`{spacing.gap.${size}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
        }),
        SIZES,
      ),
      empty: sizeVariants(
        (size) => ({ padding: dense(`{spacing.inset.${size}}`), textStyle: `body.${size}` }),
        SIZES,
      ),
      indicator: sizeVariants((size) => ({ boxSize: dense(`{sizes.icon.${size}}`) }), SIZES),
      input: sizeVariants((size) => ({ textStyle: `body.${size}` }), SIZES),
      list: sizeVariants(
        (size) => ({
          [`& .${LISTBOX}__rows`]: {
            paddingBlock: `calc(${dense(`{spacing.gap.${below(size)}}`)} + ${ROWS_PAD})`,
          },
        }),
        SIZES,
      ),
      shortcut: sizeVariants(
        (size) => ({
          borderRadius: "l1",
          paddingInline: dense(`{spacing.gap.${size}}`),
          textStyle: `label.${size}`,
        }),
        SIZES,
      ),
    }),
  },
});
