/**
 * Styles the menubar's root, which measures its row, its bar of names, a name, and the trigger a
 * crowded bar folds into.
 *
 * @remarks
 *   A name is drawn as a menu's row: no fill at rest, the palette's subtle role under the pointer,
 *   and its muted role while its menu is open, the fill a highlighted row takes, with a row's
 *   padding and text at the bar's size, so the names read as the rows they open. The root sets the
 *   palette the names read, which the root passes to its menus as well. While the root marks its
 *   row `data-crowded`, the bar is hidden and the fold trigger shows in its place. The panels are
 *   the menu recipe's, so the bar states no panel. Under forced colors an open name fills with
 *   `Highlight`, under the pointer too.
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
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, from which the binding writes each part's class.
 */
export const CLASS = "menubar";

/**
 * Sizes the bar offers, which its menus take too.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Selects the bar of a root that marks its row crowded.
 */
const CROWDED = "[data-crowded] > &";

/**
 * Selects the fold trigger of a root that marks its row crowded.
 *
 * @remarks
 *   The fold trigger is a child of its menu's root, a `div` with `display: contents`, so the
 *   crowded root is its grandparent.
 */
const FOLDED = "[data-crowded] > * > &";

/**
 * Forced colors of an open name: the system highlight, which the browser keeps.
 */
const FORCED = {
  _highContrast: { background: "Highlight", color: "HighlightText", forcedColorAdjust: "none" },
};

/**
 * Returns the styles a name shares with the fold trigger, which draw it as a menu's row that fills
 * under the pointer and while its menu is open.
 *
 * @remarks
 *   The compiler emits the hover rule after the forced-colors rule, so the open state's forced
 *   colors are restated inside the hover rule, where the open selector raises their specificity.
 */
function named(): SystemStyleObject {
  return {
    ...interactive(),
    _hover: { _open: FORCED, background: "colorPalette.subtle" },
    _open: { ...FORCED, background: "colorPalette.muted" },
    alignItems: "center",
    appearance: "none",
    background: "transparent",
    borderRadius: "l1",
    borderWidth: "0",
    color: "fg",
    display: "inline-flex",
    flexShrink: "0",
    fontWeight: "medium",
    whiteSpace: "nowrap",
  };
}

/**
 * Returns the padding, gap and text of a menu's row at a size, and a leading icon one size smaller
 * on the icon scale, which a name and the fold trigger take.
 *
 * @param size - The size of the bar.
 */
function sized(size: (typeof SIZES)[number]): SystemStyleObject {
  return {
    "& > svg": { boxSize: dense(`{sizes.icon.${below(size)}}`), flexShrink: "0" },
    gap: dense(`{spacing.gap.${size}}`),
    paddingBlock: dense(`{spacing.gap.${below(size)}}`),
    paddingInline: dense(`{spacing.inset.${below(size)}}`),
    textStyle: `body.${below(size)}`,
  };
}

/**
 * Defines the menubar recipe, in the neutral palette at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    bar: { alignItems: "center", [CROWDED]: { display: "none" } },
    fold: { ...named(), display: "none", [FOLDED]: { display: "inline-flex" } },
    root: { display: "flex", maxInlineSize: "full", minInlineSize: "0" },
    trigger: named(),
  },
  className: CLASS,
  defaultVariants: { palette: "neutral", size: "md" },
  jsx: [/^Menubar(\.\w+)?$/u],
  slots: ["root", "bar", "trigger", "fold"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Palette the names fill in under the pointer and while their menu is open, set on the root.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Padding and text of the names and the fold trigger, and the gap between the names.
     */
    size: onSlots({
      bar: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
      fold: sizeVariants(sized, SIZES),
      trigger: sizeVariants(sized, SIZES),
    }),
  },
});
